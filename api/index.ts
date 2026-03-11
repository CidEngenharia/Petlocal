import express from 'express';
import prisma from '../lib/prisma.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import stripe from '../lib/stripe.js';
import cors from 'cors';
import { authenticateJWT, AuthRequest } from '../lib/auth.js';
import { generateContent } from '../lib/gemini.js';


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

// --- STRIPE INTEGRATION --- (Imported from lib/stripe)

const app = express();
app.use(cors());
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
        console.log('Stripe Webhook: Checkout Completed', session.id);
        const { petId, type, userId, category } = session.metadata;

        if (category === 'document' && petId) {
            const id = parseInt(petId);
            try {
                await prisma.document.upsert({
                    where: { petId_type: { petId: id, type } },
                    update: { status: 'paid', stripeId: session.id },
                    create: { petId: id, type, status: 'paid', stripeId: session.id }
                });
                console.log(`Document ${type} for Pet ${id} updated to PAID`);
            } catch (dbErr) {
                console.error('Database Error in Webhook:', dbErr);
            }
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
        res.json({ token, user: { id: user.id, email: user.email, role: user.role, photoUrl: user.photoUrl } });
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
        res.json({ token, user: { id: user.id, email: user.email, role: user.role, photoUrl: user.photoUrl } });
    } catch (err: any) {
        console.error('CRITICAL LOGIN ERROR:', err);
        res.status(500).json({
            error: 'Erro interno no servidor ao tentar entrar.',
            details: err.message,
            code: err.code
        });
    }
});

// Update Profile (protected)
app.put('/api/auth/profile', authenticateJWT, async (req: AuthRequest, res) => {
    const { photoUrl } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { photoUrl }
        });
        res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, photoUrl: user.photoUrl } });
    } catch (err: any) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
});

// Pets, Vaccines, Services, Documents
app.get('/api/pets/:ownerId', authenticateJWT, async (req: AuthRequest, res) => {
    const ownerId = parseInt(req.params.ownerId);

    // Security: Only allow user to view their own pets
    if (req.user?.id !== ownerId) {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const pets = await prisma.pet.findMany({
        where: { ownerId },
        include: { vaccines: true, documents: true }
    });
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
                        email: true,
                        photoUrl: true
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

// GET Admin System Data (Protected & Exclusive)
app.get('/api/admin/system-data', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') {
        return res.status(403).json({ error: 'Acesso negado. Somente administradores globais.' });
    }

    try {
        const [usersCount, petsCount, servicesCount, accessoriesCount, documentsCount] = await Promise.all([
            prisma.user.count(),
            prisma.pet.count(),
            prisma.service.count(),
            prisma.accessory.count(),
            prisma.document.count()
        ]);

        const [pets, services, accessories, users] = await Promise.all([
            prisma.pet.findMany({
                include: {
                    owner: { select: { email: true, photoUrl: true } },
                    documents: true,
                    vaccines: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.service.findMany({
                include: { provider: { select: { email: true, photoUrl: true } } },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.accessory.findMany({
                include: { owner: { select: { email: true, photoUrl: true } } },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    role: true,
                    photoUrl: true,
                    createdAt: true,
                    _count: {
                        select: {
                            pets: true,
                            services: true,
                            accessories: true,
                            subscriptions: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        res.json({
            stats: {
                users: usersCount,
                pets: petsCount,
                services: servicesCount,
                accessories: accessoriesCount,
                documents: documentsCount
            },
            data: {
                pets,
                services,
                accessories,
                users
            }
        });
    } catch (err: any) {
        console.error('Admin Data Error:', err);
        res.status(500).json({ error: 'Erro ao buscar dados globais do sistema' });
    }
});

// Admin CRUD - Users
app.put('/api/admin/users/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    const { email, role, photoUrl } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: { email, role, photoUrl }
        });
        res.json(user);
    } catch (err) { res.status(500).json({ error: 'Erro ao atualizar usuário' }); }
});

app.delete('/api/admin/users/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    try {
        await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Erro ao deletar usuário' }); }
});

// Admin CRUD - Pets
app.put('/api/admin/pets/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    const { name, species, breed, birthDate, intent, city, state, contact } = req.body;
    try {
        const pet = await prisma.pet.update({
            where: { id: parseInt(req.params.id) },
            data: { name, species, breed, birthDate, intent, city, state, contact }
        });
        res.json(pet);
    } catch (err) { res.status(500).json({ error: 'Erro ao atualizar pet' }); }
});

app.delete('/api/admin/pets/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    try {
        await prisma.pet.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Erro ao deletar pet' }); }
});

// Admin CRUD - Services
app.delete('/api/admin/services/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    try {
        await prisma.service.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Erro ao deletar serviço' }); }
});

app.put('/api/admin/services/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    const { name, type, price, description } = req.body;
    try {
        const service = await prisma.service.update({
            where: { id: parseInt(req.params.id) },
            data: { name, type, price: parseFloat(price), description }
        });
        res.json(service);
    } catch (err) { res.status(500).json({ error: 'Erro ao atualizar serviço' }); }
});

// Admin CRUD - Accessories
app.delete('/api/admin/accessories/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    try {
        await prisma.accessory.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Erro ao deletar acessório' }); }
});

app.put('/api/admin/accessories/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    const { name, category, price, description } = req.body;
    try {
        const accessory = await prisma.accessory.update({
            where: { id: parseInt(req.params.id) },
            data: { name, category, price: parseFloat(price), description }
        });
        res.json(accessory);
    } catch (err) { res.status(500).json({ error: 'Erro ao atualizar acessório' }); }
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
                contact: true,
                owner: {
                    select: {
                        photoUrl: true
                    }
                }
            }
        });
        res.json(pets);
    } catch (err: any) {
        res.status(500).json({ error: 'Erro ao buscar top 10' });
    }
});

app.post('/api/pets', authenticateJWT, async (req: AuthRequest, res) => {
    const { name, species, breed, birthDate, photoUrl, ownerPhotoUrl, weight, gender, address, city, state, contact, intent, intentDescription } = req.body;
    const ownerId = req.user?.id;

    if (!ownerId) return res.status(401).json({ error: 'Não autorizado' });

    try {
        const pet = await prisma.pet.create({
            data: {
                ownerId,
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

app.put('/api/pets/:id', authenticateJWT, async (req: AuthRequest, res) => {
    const { name, species, breed, birthDate, photoUrl, ownerPhotoUrl, weight, gender, address, city, state, contact, intent, intentDescription } = req.body;
    try {
        // Check ownership
        const pet = await prisma.pet.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!pet || pet.ownerId !== req.user?.id) return res.status(403).json({ error: 'Não autorizado' });

        const updatedPet = await prisma.pet.update({
            where: { id: parseInt(req.params.id) },
            data: { name, species, breed, birthDate, photoUrl, ownerPhotoUrl, weight, gender, address, city, state, contact, intent, intentDescription }
        });
        res.json(updatedPet);
    } catch (err: any) {
        console.error('Error updating pet:', err);
        res.status(500).json({ error: 'Erro ao atualizar pet', details: err.message });
    }
});

app.delete('/api/pets/:id', authenticateJWT, async (req: AuthRequest, res) => {
    try {
        // Check ownership
        const pet = await prisma.pet.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!pet || pet.ownerId !== req.user?.id) return res.status(403).json({ error: 'Não autorizado' });

        await prisma.pet.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err: any) {
        console.error('Error deleting pet:', err);
        res.status(500).json({ error: 'Erro ao excluir pet' });
    }
});

app.get('/api/vaccines/:petId', authenticateJWT, async (req: AuthRequest, res) => {
    try {
        const petId = parseInt(req.params.petId);
        const pet = await prisma.pet.findUnique({ where: { id: petId } });

        if (!pet || pet.ownerId !== req.user?.id) {
            return res.status(403).json({ error: 'Não autorizado' });
        }

        const vaccines = await prisma.vaccine.findMany({ where: { petId } });
        res.json(vaccines);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar vacinas' });
    }
});

app.post('/api/vaccines', authenticateJWT, async (req: AuthRequest, res) => {
    const { pet_id, name, date, next_due } = req.body;
    try {
        const petId = parseInt(pet_id);
        const pet = await prisma.pet.findUnique({ where: { id: petId } });
        if (!pet || pet.ownerId !== req.user?.id) return res.status(403).json({ error: 'Não autorizado' });

        const vaccine = await prisma.vaccine.create({
            data: { petId, name, date, nextDue: next_due }
        });
        res.json(vaccine);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao cadastrar vacina' });
    }
});

app.get('/api/services', async (req, res) => {
    const services = await prisma.service.findMany({
        include: {
            provider: {
                select: {
                    photoUrl: true
                }
            },
            reviews: {
                include: {
                    user: { select: { email: true, photoUrl: true } }
                }
            },
            comments: {
                include: {
                    user: { select: { email: true, photoUrl: true } }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    const servicesWithRating = services.map(s => {
        const avg = s.reviews.length > 0 ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length : 0;
        return { ...s, avgRating: Math.round(avg * 10) / 10, reviewCount: s.reviews.length };
    });
    res.json(servicesWithRating);
});

app.get('/api/services/provider/:providerId', async (req, res) => {
    const services = await prisma.service.findMany({ where: { providerId: parseInt(req.params.providerId) } });
    res.json(services);
});

app.post('/api/services', authenticateJWT, async (req: AuthRequest, res) => {
    const { type, name, description, price, location, whatsapp, instagram, photo_url } = req.body;
    const providerId = req.user?.id;
    if (!providerId) return res.status(401).json({ error: 'Não autorizado' });

    try {
        const service = await prisma.service.create({
            data: { providerId, type, name, description, price: parseFloat(price), location, whatsapp, instagram, photoUrl: photo_url }
        });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao cadastrar serviço' });
    }
});

app.put('/api/services/:id', authenticateJWT, async (req: AuthRequest, res) => {
    const { type, name, description, price, location, whatsapp, instagram, photo_url } = req.body;
    try {
        const service = await prisma.service.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!service || service.providerId !== req.user?.id) return res.status(403).json({ error: 'Não autorizado' });

        const updatedService = await prisma.service.update({
            where: { id: parseInt(req.params.id) },
            data: { type, name, description, price: parseFloat(price), location, whatsapp, instagram, photoUrl: photo_url }
        });
        res.json(updatedService);
    } catch (err: any) {
        console.error('Error updating service:', err);
        res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
});

app.delete('/api/services/:id', authenticateJWT, async (req: AuthRequest, res) => {
    try {
        const service = await prisma.service.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!service || service.providerId !== req.user?.id) return res.status(403).json({ error: 'Não autorizado' });

        await prisma.service.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err: any) {
        console.error('Error deleting service:', err);
        res.status(500).json({ error: 'Erro ao excluir serviço' });
    }
});

app.get('/api/documents/:petId', authenticateJWT, async (req: AuthRequest, res) => {
    try {
        const petId = parseInt(req.params.petId);
        const pet = await prisma.pet.findUnique({ where: { id: petId } });

        if (!pet || pet.ownerId !== req.user?.id) {
            return res.status(403).json({ error: 'Não autorizado' });
        }

        const docs = await prisma.document.findMany({ where: { petId } });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar documentos' });
    }
});
app.post('/api/documents/order', authenticateJWT, async (req: AuthRequest, res) => {
    const { pet_id, type } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

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
            metadata: { petId: pet_id.toString(), type, userId: userId.toString() || '0', category: 'document' }
        });
        res.json({ url: session.url });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ===== SERVICE REVIEWS =====
app.post('/api/services/:id/review', authenticateJWT, async (req: AuthRequest, res) => {
    const serviceId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { rating } = req.body;
    if (!userId) return res.status(401).json({ error: 'Não autorizado' });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Avaliação deve ser de 1 a 5' });

    try {
        const existing = await prisma.serviceReview.findUnique({ where: { serviceId_userId: { serviceId, userId } } });
        if (existing) {
            const updated = await prisma.serviceReview.update({
                where: { id: existing.id },
                data: { rating }
            });
            return res.json(updated);
        }
        const review = await prisma.serviceReview.create({ data: { serviceId, userId, rating } });
        res.json(review);
    } catch (err: any) {
        console.error('Error creating review:', err);
        res.status(500).json({ error: 'Erro ao avaliar serviço' });
    }
});

// ===== SERVICE COMMENTS =====
app.post('/api/services/:id/comment', authenticateJWT, async (req: AuthRequest, res) => {
    const serviceId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { text } = req.body;
    if (!userId) return res.status(401).json({ error: 'Não autorizado' });
    if (!text || text.trim().length === 0) return res.status(400).json({ error: 'Comentário vazio' });

    try {
        const comment = await prisma.serviceComment.create({ data: { serviceId, userId, text: text.trim() } });
        const full = await prisma.serviceComment.findUnique({
            where: { id: comment.id },
            include: { user: { select: { email: true, photoUrl: true } } }
        });
        res.json(full);
    } catch (err: any) {
        console.error('Error creating comment:', err);
        res.status(500).json({ error: 'Erro ao comentar' });
    }
});

app.delete('/api/services/comment/:id', authenticateJWT, async (req: AuthRequest, res) => {
    const commentId = parseInt(req.params.id);
    const userId = req.user?.id;
    try {
        const comment = await prisma.serviceComment.findUnique({ where: { id: commentId } });
        if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
        if (comment.userId !== userId && req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Não autorizado' });
        await prisma.serviceComment.delete({ where: { id: commentId } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir comentário' });
    }
});

// ===== ADMIN: Reviews & Comments CRUD =====
app.delete('/api/admin/reviews/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    try {
        await prisma.serviceReview.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Erro ao deletar avaliação' }); }
});

app.delete('/api/admin/comments/:id', authenticateJWT, async (req: AuthRequest, res) => {
    if (req.user?.role !== 'global_admin') return res.status(403).json({ error: 'Acesso negado' });
    try {
        await prisma.serviceComment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Erro ao deletar comentário' }); }
});

app.put('/api/services/comments/:id', authenticateJWT, async (req: AuthRequest, res) => {
    const { text } = req.body;
    try {
        const comment = await prisma.serviceComment.update({
            where: { id: parseInt(req.params.id) },
            data: { text }
        });
        res.json(comment);
    } catch (err: any) {
        res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
});

// ===== DOGMIX AI ENDPOINTS (GEMINI POWERED) =====

app.post('/api/dogmix/simulate', async (req, res) => {
    const { breed1, breed2 } = req.body;
    if (!breed1 || !breed2) return res.status(400).json({ error: 'Informe as duas raças' });

    try {
        const prompt = `Simule um cruzamento entre as raças de cachorro "${breed1}" e "${breed2}".
        Retorne um JSON exatamente neste formato:
        {
          "mixName": "nome criativo do mix",
          "size": "porte (Pequeno, Médio ou Grande)",
          "description": "uma descrição cativante em português",
          "traits": ["lista de 4-6 características/adjetivos"]
        }
        Responda apenas com o JSON.`;

        const responseText = await generateContent(prompt);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Falha ao gerar resposta estruturada');
        
        const result = JSON.parse(jsonMatch[0]);
        res.json({ ...result, breed1, breed2 });
    } catch (err: any) {
        console.error('Simulate Error:', err);
        res.status(500).json({ error: 'Erro ao simular mix' });
    }
});

app.post('/api/dogmix/generate-name', async (req, res) => {
    const { words } = req.body;
    if (!words || !Array.isArray(words) || words.length < 1) return res.status(400).json({ error: 'Informe palavras-chave' });

    try {
        const prompt = `Gere sugestões de nomes para um pet baseadas nestas palavras: ${words.join(', ')}.
        Retorne um JSON exatamente neste formato:
        {
          "name": "o melhor nome",
          "alternatives": ["outras 4 opções"],
          "reason": "uma justificativa curta em português de por que o nome principal foi escolhido"
        }
        Responda apenas com o JSON.`;

        const responseText = await generateContent(prompt);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Falha ao gerar nomes');
        
        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
    } catch (err: any) {
        console.error('Generate Name Error:', err);
        res.status(500).json({ error: 'Erro ao gerar nomes' });
    }
});

app.post('/api/dogmix/name-meaning', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Informe o nome' });

    try {
        const prompt = `Explique o significado do nome de pet "${name}" de forma carinhosa e interessante.
        Retorne um JSON exatamente neste formato:
        {
          "name": "${name}",
          "meaning": "uma explicação cativante em português com emojis"
        }
        Responda apenas com o JSON.`;

        const responseText = await generateContent(prompt);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Falha ao gerar significado');
        
        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
    } catch (err: any) {
        console.error('Name Meaning Error:', err);
        res.status(500).json({ error: 'Erro ao buscar significado' });
    }
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
app.post('/api/accessories', authenticateJWT, async (req: AuthRequest, res) => {
    const { name, description, price, category, photoUrl } = req.body;
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(401).json({ error: 'Não autorizado' });

    try {
        const accessory = await prisma.accessory.create({
            data: {
                ownerId,
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
