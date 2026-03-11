import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const petCount = await prisma.pet.count();
    const serviceCount = await prisma.service.count();
    
    console.log(`\n--- DB RECAP ---`);
    console.log(`Users registered: ${userCount}`);
    console.log(`Pets registered: ${petCount}`);
    console.log(`Services registered: ${serviceCount}`);
    
    if (petCount > 0) {
      const somePets = await prisma.pet.findMany({
        take: 3,
        select: { name: true, type: true }
      });
      console.log('Sample Pets:', somePets);
    }
  } catch (e) {
    console.error('Error checking DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
