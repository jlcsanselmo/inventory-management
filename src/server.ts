import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Banco de Dados
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

//Cliente Prisma 
const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors());
app.use(express.json());

//Rota de Produtos
app.get('/products', async (request, response) => {
    try {
        const products = await prisma.product.findMany();
        response.json(products);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

app.listen(3000, () => {
    console.log(' Servidor rodando na porta 3000!');
});