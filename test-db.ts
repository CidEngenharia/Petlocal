import prisma from './lib/prisma.js';

async function test() {
    console.log('Testando conexão com o banco de dados...');
    try {
        await prisma.$connect();
        console.log('Conexão bem-sucedida!');
        const usersCount = await prisma.user.count();
        console.log('Número de usuários:', usersCount);
    } catch (err) {
        console.error('Falha na conexão:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
