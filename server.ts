import express from 'express';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe'; // Added Stripe import

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// --- STRIPE INTEGRATION ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

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

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashedPassword, role: role || 'owner' } });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) { res.status(400).json({ error: 'User already exists' }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// Pets
app.get('/api/pets/:ownerId', async (req, res) => {
  const pets = await prisma.pet.findMany({ where: { ownerId: parseInt(req.params.ownerId) }, include: { vaccines: true, documents: true } });
  res.json(pets);
});

app.post('/api/pets', async (req, res) => {
  const { owner_id, name, species, breed, birth_date, photo_url, weight, gender, address, city, state, contact } = req.body;
  const pet = await prisma.pet.create({ data: { ownerId: parseInt(owner_id), name, species, breed, birthDate: birth_date, photoUrl: photo_url, weight, gender, address, city, state, contact } });
  res.json(pet);
});

app.put('/api/pets/:id', async (req, res) => {
  const pet = await prisma.pet.update({ where: { id: parseInt(req.params.id) }, data: req.body });
  res.json(pet);
});

// Vaccines
app.get('/api/vaccines/:petId', async (req, res) => {
  const vaccines = await prisma.vaccine.findMany({ where: { petId: parseInt(req.params.petId) } });
  res.json(vaccines);
});

app.post('/api/vaccines', async (req, res) => {
  const { pet_id, name, date, next_due } = req.body;
  const vaccine = await prisma.vaccine.create({ data: { petId: parseInt(pet_id), name, date, nextDue: next_due } });
  res.json(vaccine);
});

// Services
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

// Documents
app.get('/api/documents/:petId', async (req, res) => {
  const docs = await prisma.document.findMany({ where: { petId: parseInt(req.params.petId) } });
  res.json(docs);
});

app.post('/api/documents/order', async (req, res) => {
  const { pet_id, type, user_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: type === 'RG' ? 'RG Pet Digital' : 'Certidão de Nascimento Pet' },
          unit_amount: type === 'RG' ? 2990 : 1990,
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

async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      }
    });
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
