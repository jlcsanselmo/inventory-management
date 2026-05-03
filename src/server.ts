import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { z } from "zod";
import pg from 'pg';

const productSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    description: z.string().min(1, "A descrição é obrigatória"),
    price: z.number().positive("O preço deve ser maior que zero"),
    stock_quantify: z.number().int().nonnegative("O estoque não pode ser negativo")
});

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
        const validatedData = productSchema.parse(request.body); // aplicando o metodo zod

        const newProduct = await prisma.product.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                price: validatedData.price,
                stock_quantify: validatedData.stock_quantify,
            },
        });
        response.status(201).json(newProduct);
    } catch (error) {

        if (error instanceof z.ZodError) {
            return response.status(400).json({
                message: "Dados inválidos",
                errors: error.errors
            });
        }
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
        const validatedData = productSchema.parse(request.body);

        const { id } = request.params;
        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                price: validatedData.price,
                stock_quantify: validatedData.stock_quantify,
            },
        });
        response.json(updatedProduct);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(400).json({
                message: "Dados inválidos",
                errors: error.errors
            });
        }
        console.error(error);
        response.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

app.listen(3000, () => {
    console.log(' Servidor rodando na porta 3000!');
});