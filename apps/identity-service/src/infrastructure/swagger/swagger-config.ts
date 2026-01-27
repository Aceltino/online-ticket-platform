import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Identity Service',
      version: '1.0.0',
      description: 'Serviço de Autenticação e Gestão de Usuários',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  // 👇 ISSO AQUI É O OURO
 apis: [
    './apps/identity-service/src/**/*.routes.ts',
    './apps/identity-service/src/**/*.controller.ts',    
  ],
});
