import prisma from './lib/prisma';

async function main() {
    try {
        console.log('Tentando conectar ao banco de dados...');
        const petCount = await prisma.pet.count();
        console.log(`Conexão bem-sucedida! Número de pets: ${petCount}`);

        const firstPet = await prisma.pet.findFirst();
        if (firstPet) {
            console.log('Primeiro pet encontrado:', firstPet.name);
            console.log('Campos presentes:', Object.keys(firstPet));
        } else {
            console.log('Nenhum pet encontrado no banco.');
        }
    } catch (error) {
        console.error('Erro ao conectar ou consultar o banco de dados:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
