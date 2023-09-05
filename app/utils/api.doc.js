// utils/api.doc.js
import { fileURLToPath } from 'url';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const setupSwagger = (app) => {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'oInvest API',
        description: 'oInvest API docs',
        contact: {
          name: 'oInvest Team',
        },
      },
      servers: ['http://localhost:3001'],
    },
    apis: [path.resolve(__dirname, '../router/index.js')],
  };

  const specs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
