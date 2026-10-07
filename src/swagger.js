// 1. Importamos a biblioteca e já a executamos chamando ()
const swaggerAutogen = require('swagger-autogen')();

// 2. Definimos as informações básicas da nossa API
const doc = {
    info: {
        title: 'Sabor Digital API',
        description: 'Documentação automática da API Sabor Digital utilizando Swagger Autogen',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    
    // 3. (Muito Importante) Configuramos que nossa API usa Token JWT
    // Isso fará o botão de "Cadeado" (Authorize) aparecer na tela!
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
};

// 4. Onde o arquivo JSON mágico será salvo?
const outputFile = './swagger_output.json';

// 5. Qual arquivo o robô deve ler para encontrar nossas rotas?
// Ele vai ler o index.js de rotas, que por sua vez importa todas as outras!
const endpointsFiles = ['./src/routes/index.js']; 

// 6. Finalmente, mandamos o robô trabalhar!
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Documentação do Swagger gerada com sucesso!");
});