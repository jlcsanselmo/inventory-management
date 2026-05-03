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

app.post('/products', async (request, response) => {
    try {
        const { name, description, price, stock_quantify } = request.body;
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock_quantify,
            },
        });
        response.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Erro ao criar produto" });
    }
});

app.delete('/products/:id', async (request, response) => {
    try {
        const { id } = request.params;
        await prisma.product.delete({
            where: { id: id },
        });
        response.status(204).send();
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Erro ao deletar produto" });
    }
});
app.put('/products/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { name, description, price, stock_quantify } = request.body;
        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: {
                name,
                description,
                price,
                stock_quantify,
            },
        });
        response.json(updatedProduct);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

app.listen(3000, () => {
    console.log(' Servidor rodando na porta 3000!');
});