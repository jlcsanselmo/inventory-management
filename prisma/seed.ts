import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Configura o adaptador usando a URL do seu banco
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
});

// Passa o adaptador para dentro do Prisma Client
const prisma = new PrismaClient({ adapter });
async function main() {
    const product1 = await prisma.product.create({
        data: {
            name: 'Notebook Pro',
            description: 'Notebook de alta performance com 16GB RAM',
            price: 4500.00,
            stock_quantify: 10,
        },
    });

    console.log('Produto semeado:', product1.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });