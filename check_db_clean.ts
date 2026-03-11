import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const petCount = await prisma.pet.count();
    console.log(`\n--- DB STATUS ---`);
    console.log(`Users: ${userCount}`);
    console.log(`Pets: ${petCount}`);
    
    const pets = await prisma.pet.findMany({
      select: { name: true, type: true }
    });
    console.log('Pets list:', pets);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
