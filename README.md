# Sistema de Gestão de Inventário (Fullstack)
<img width="1913" height="951" alt="image" src="https://github.com/user-attachments/assets/d00644cc-71c8-4bc2-ac58-e62bb2a01dfe" />

## Objetivo
Aplicação Fullstack para gerenciamento de produtos com operações de CRUD completo.

## Tecnologias Utilizadas
- **Backend:** Node.js, TypeScript, Express, PostgreSQL.
- **ORM:** Prisma.
- **Frontend:** React, TypeScript, React Hooks (useState, useEffect).
- **Validação:** Zod (Validação de schemas da API).
- **Containerização:** Docker e Docker Compose.

## Arquitetura
O projeto segue princípios de **Clean Code**, com a seguinte divisão de responsabilidades:
- **Controllers:** Gerenciamento das requisições e respostas HTTP.
- **Prisma/PostgreSQL:** Persistência de dados com uso de UUID e timestamps.

## Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a Passo
1. Clone o repositório.
2. Na raiz do projeto, execute:
   ```bash
   docker-compose up --build
