import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const petCount = await prisma.pet.count();
    console.log(`Users: ${userCount}`);
    console.log(`Pets: ${petCount}`);
    
    const pets = await prisma.pet.findMany({
      include: { owner: true }
    });
    console.log('Last 5 pets:', pets.slice(-5));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
