// apps/api-gateway/src/main.ts
import express from 'express';
import router from './routes'; // <--- Importante!

const app = express();

// Opcional: Se as rotas locais precisarem de JSON
// Mas cuidado: se colocar antes do router, o fixRequestBody acima é OBRIGATÓRIO
app.use(express.json()); 

app.use(router); // <--- Ativa os proxies

app.listen(8080, '0.0.0.0', () => {
  console.log('🚀 Gateway running on port 8080');
});