import "dotenv/config";
import express from 'express';
import cors from 'cors';

import { ProductController } from './controllers/ProductController';

const app = express();

app.use(cors());
app.use(express.json());

// rotas do controllers
app.get('/products', ProductController.listar);
app.post('/products', ProductController.criar);
app.put('/products/:id', ProductController.atualizar);
app.delete('/products/:id', ProductController.excluir);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000!');
});