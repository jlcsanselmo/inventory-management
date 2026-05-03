FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# O --host é necessário para o Docker conseguir expor a porta corretamente
CMD ["npm", "run", "dev", "--", "--host"]