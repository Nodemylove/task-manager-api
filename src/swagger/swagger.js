const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Task Manager API',
      version:     '1.0.0',
      description: 'Node.js REST API — PostgreSQL + Knex + Docker + JWT + Zod',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], // scan route files for @swagger comments
};

module.exports = swaggerJsdoc(options);