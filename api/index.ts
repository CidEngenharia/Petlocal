import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';

if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
    dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

console.log('Server Init: Checking Environment...');
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 20));
}

// --- STRIPE INTEGRATION ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Stripe Webhook needs raw body, must be BEFORE express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const { petId, type, userId, category } = session.metadata;
        if (category === 'document') {
            const id = parseInt(petId);
            await prisma.document.upsert({
                where: { petId_type: { petId: id, type } },
                update: { status: 'paid' },
                create: { petId: id, type, status: 'paid' }
            });
        }
    }
    res.json({ received: true });
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
app.get('/api/health', async (req, res) => {
    try {
        console.log('Health check: Attempting DB connect...');
        await prisma.$connect();
        console.log('Health check: DB connected successfully');
        res.json({
            status: 'ok',
            env: process.env.NODE_ENV,
            vercel: !!process.env.VERCEL,
            database: 'connected'
        });
    } catch (err: any) {
        console.error('Health check failed:', err);
        res.status(500).json({
            status: 'error',
            error: 'Database connection failed',
            details: err.message
        });
    }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { email, password, role } = req.body;
    console.log(`Registration start for: ${email}`);
    try {
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Creating user in DB...');
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'owner'
            }
        });
        console.log('User created successfully ID:', user.id);
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err: any) {
        console.error('CRITICAL REGISTER ERROR:', err);
        if (err.code === 'P2002') return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        res.status(500).json({
            error: 'Erro no servidor ao criar conta.',
            details: err.message,
            code: err.code,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
        console.log('Login successful for:', email);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err: any) {
        console.error('CRITICAL LOGIN ERROR:', err);
        res.status(500).json({
            error: 'Erro interno no servidor ao tentar entrar.',
            details: err.message,
            code: err.code
        });
    }
});

// Pets, Vaccines, Services, Documents
app.get('/api/pets/:ownerId', async (req, res) => {
    const pets = await prisma.pet.findMany({ where: { ownerId: parseInt(req.params.ownerId) }, include: { vaccines: true, documents: true } });
    res.json(pets);
});

// GET Public 
app.get('/api/public/pets', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Delete pets that are deceased AND older than 30 days (cleanup)
        await prisma.pet.deleteMany({
            where: {
                intent: 'deceased',
                updatedAt: { lt: thirtyDaysAgo }
            }
        });

        const pets = await prisma.pet.findMany({
            where: {
                OR: [
                    { intent: { in: ['adoption', 'sale', 'breeding', 'lost', 'found', 'registrado'] } },
                    {
                        intent: 'deceased',
                        updatedAt: { gte: thirtyDaysAgo }
                    }
                ]
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(pets);
    } catch (err: any) {
        res.status(500).json({ error: 'Erro ao buscar pets públicos' });
    }
});

// GET Top 10 Pets (Last 10 registered, public)
app.get('/api/public/top10', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const pets = await prisma.pet.findMany({
            where: {
                OR: [
                    { intent: { in: ['adoption', 'sale', 'breeding', 'lost', 'found', 'registrado', 'none'] } },
                    {
                        intent: 'deceased',
                        updatedAt: { gte: thirtyDaysAgo }
                    }
                ]
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                species: true,
                breed: true,
                photoUrl: true,
                ownerPhotoUrl: true,
                city: true,
                state: true,
                intent: true,
                gender: true,
                weight: true,
                contact: true
            }
        });
        res.json(pets);
    } catch (err: any) {
        res.status(500).json({ error: 'Erro ao buscar top 10' });
    }
});

app.post('/api/pets', async (req, res) => {
    const { owner_id, name, species, breed, birthDate, photoUrl, ownerPhotoUrl, weight, gender, address, city, state, contact, intent, intentDescription } = req.body;
    try {
        const pet = await prisma.pet.create({
            data: {
                ownerId: parseInt(owner_id),
                name,
                species,
                breed,
                birthDate,
                photoUrl,
                ownerPhotoUrl,
                weight,
                gender,
                address,
                city,
                state,
                contact,
                intent: intent || 'none',
                intentDescription
            }
        });
        res.json(pet);
    } catch (err: any) {
        console.error('Error creating pet:', err);
        res.status(500).json({ error: 'Erro ao cadastrar pet', details: err.message });
    }
});

app.put('/api/pets/:id', async (req, res) => {
    const { name, species, breed, birthDate, photoUrl, ownerPhotoUrl, weight, gender, address, city, state, contact, intent, intentDescription } = req.body;
    try {
        const pet = await prisma.pet.update({
            where: { id: parseInt(req.params.id) },
            data: { name, species, breed, birthDate, photoUrl, ownerPhotoUrl, weight, gender, address, city, state, contact, intent, intentDescription }
        });
        res.json(pet);
    } catch (err: any) {
        console.error('Error updating pet:', err);
        res.status(500).json({ error: 'Erro ao atualizar pet', details: err.message });
    }
});

app.get('/api/vaccines/:petId', async (req, res) => {
    const vaccines = await prisma.vaccine.findMany({ where: { petId: parseInt(req.params.petId) } });
    res.json(vaccines);
});

app.post('/api/vaccines', async (req, res) => {
    const { pet_id, name, date, next_due } = req.body;
    const vaccine = await prisma.vaccine.create({ data: { petId: parseInt(pet_id), name, date, nextDue: next_due } });
    res.json(vaccine);
});

app.get('/api/services', async (req, res) => {
    const services = await prisma.service.findMany();
    res.json(services);
});

app.get('/api/services/provider/:providerId', async (req, res) => {
    const services = await prisma.service.findMany({ where: { providerId: parseInt(req.params.providerId) } });
    res.json(services);
});

app.post('/api/services', async (req, res) => {
    const { provider_id, type, name, description, price, location, whatsapp, instagram, photo_url } = req.body;
    const service = await prisma.service.create({ data: { providerId: parseInt(provider_id), type, name, description, price: parseFloat(price), location, whatsapp, instagram, photoUrl: photo_url } });
    res.json(service);
});

app.get('/api/documents/:petId', async (req, res) => {
    const docs = await prisma.document.findMany({ where: { petId: parseInt(req.params.petId) } });
    res.json(docs);
});
app.post('/api/documents/order', async (req, res) => {
    const { pet_id, type, user_id } = req.body;
    try {
        let productName = '';
        let amount = 0;

        switch (type) {
            case 'COMBO':
                productName = 'Combo Digital (RG + Certidão + Vacina)';
                amount = 2990;
                break;
            case 'TAG_KEYCHAIN':
                productName = 'Chaveiro Tag de Identificação';
                amount = 2990;
                break;
            case 'RG':
                productName = 'RG Pet Digital';
                amount = 1590;
                break;
            case 'BIRTH_CERT':
                productName = 'Certidão de Nascimento';
                amount = 1590;
                break;
            case 'VACCINE_CARD':
                productName = 'Carteira de Vacinação';
                amount = 1590;
                break;
            case 'QR_CODE':
                productName = 'QR Code de Identificação';
                amount = 1590;
                break;
            default:
                productName = 'Documento Pet';
                amount = 1590;
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'brl',
                    product_data: { name: productName },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
            metadata: { petId: pet_id.toString(), type, userId: user_id?.toString() || '0', category: 'document' }
        });
        res.json({ url: session.url });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Static assets for production (Only for non-Vercel environments)
if ((process.env.NODE_ENV === 'production') && !process.env.VERCEL && !process.env.VERCEL_ENV) {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(__dirname, '../dist', 'index.html'));
        }
    });
}


// GET Public Accessories
app.get('/api/public/accessories', async (req, res) => {
    try {
        const accessories = await prisma.accessory.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(accessories);
    } catch (err: any) {
        res.status(500).json({ error: 'Erro ao buscar acessórios' });
    }
});

// POST New Accessory (Protected)
app.post('/api/accessories', async (req, res) => {
    const { owner_id, name, description, price, category, photoUrl } = req.body;
    try {
        const accessory = await prisma.accessory.create({
            data: {
                ownerId: parseInt(owner_id),
                name,
                description,
                price: parseFloat(price),
                category,
                photoUrl
            }
        });
        res.json(accessory);
    } catch (err: any) {
        console.error('Error creating accessory:', err);
        res.status(500).json({ error: 'Erro ao cadastrar acessório' });
    }
});

// GET Pets for Sale (Public)
app.get('/api/public/pets/sale', async (req, res) => {
    try {
        const pets = await prisma.pet.findMany({
            where: { intent: 'sale' },
            orderBy: { createdAt: 'desc' }
        });
        res.json(pets);
    } catch (err: any) {
        res.status(500).json({ error: 'Erro ao buscar pets para venda' });
    }
});

// Development setup
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && !process.env.VERCEL_ENV) {
    async function setupDev() {
        try {
            console.log('Starting Vite development server from api/index.ts...');
            const { createServer: createViteServer } = await import('vite');
            // Root is one level up
            const vite = await createViteServer({
                root: path.join(__dirname, '..'),
                server: { middlewareMode: true },
                appType: 'spa'
            });
            app.use(vite.middlewares);

            app.listen(PORT, '0.0.0.0', () => {
                console.log(`Server running on http://localhost:${PORT}`);
            });
        } catch (err) {
            console.error('SERVER FATAL ERROR DURING STARTUP:', err);
        }
    }
    setupDev().catch(err => {
        console.error('Vite setup failed:', err);
    });
} else {
    console.log('Production/Vercel mode: Skipping Vite setup and port binding.');
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception thrown:', err);
    });
}

export default app;
