import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { z } from 'zod';
import "dotenv/config";

// Trazemos o Prisma pra cá
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Trazemos o Zod pra cá
const productSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    description: z.string().min(1, "A descrição é obrigatória"),
    price: z.number().positive("O preço deve ser maior que zero"),
    stock_quantify: z.number().int().nonnegative("O estoque não pode ser negativo")
});

export const ProductController = {
    // 1. Função de buscar produtos
    async listar(request: Request, response: Response) {
        try {
            const products = await prisma.product.findMany();
            response.json(products);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Erro ao buscar produtos" });
        }
    },

    // 2. Função de criar produto
    async criar(request: Request, response: Response) {
        try {
            const validatedData = productSchema.parse(request.body);
            const newProduct = await prisma.product.create({
                data: validatedData
            });
            response.status(201).json(newProduct);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return response.status(400).json({ message: "Dados inválidos", errors: error.errors });
            }
            console.error(error);
            response.status(500).json({ error: "Erro interno ao criar produto" });
        }
    },

    // 3. Função de atualizar produto
    async atualizar(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const validatedData = productSchema.parse(request.body);
            const updatedProduct = await prisma.product.update({
                where: { id: id },
                data: validatedData
            });
            response.json(updatedProduct);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return response.status(400).json({ message: "Dados inválidos", errors: error.errors });
            }
            console.error(error);
            response.status(500).json({ error: "Erro interno ao atualizar produto" });
        }
    },

    // 4. Função de excluir produto
    async excluir(request: Request, response: Response) {
        try {
            const { id } = request.params;
            await prisma.product.delete({ where: { id: id } });
            response.status(204).send();
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Erro ao excluir produto" });
        }
    }
};