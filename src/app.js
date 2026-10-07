const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const routes = require('./routes'); 
const authRoutes = require('./routes/authRoutes')

// [1] e [2] Importações do Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

// Middlewares globais
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json());

// Servir arquivos estáticos (como as imagens de uploads)
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Registro de todas as rotas da API centralizadas
app.use('/', routes);

app.use('/auth', authRoutes)

//[3] Criando a rota mágica da Documentação
// Sempre que alguém acessar localhost:3000/api-docs, o swagger vai desenhar a tela
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports = app;