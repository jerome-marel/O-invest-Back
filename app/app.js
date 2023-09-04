/* eslint-disable no-underscore-dangle */
// Import des modules
import express from 'express';
import cors from 'cors'; // MW qui active cors
import { fileURLToPath } from 'url';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import router from './router/index.js'; // Importation des routes de l'application.

const app = express(); // Init de l'app Express.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// MW qui permet au serveur de traiter les req avec du contenu JSON.
app.use(express.json());

// MW qui permet au serveur de traiter les req avec du contenu sous forme URL encodée.
app.use(express.urlencoded({ extended: true }));

// Activation du MW CORS. car front et backend hébergés séparément.
app.use(cors(process.env.CORS_DOMAINS ?? 'localhost'));

// Utilisation des routes définies dans le router importé.
app.use(router);

// Swagger stuff
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'oInvest API',
      description: 'oInvest API docs',
      contact: {
        name: 'Dev Team',
      },
    },
    servers: ['http://localhost:3001'],
  },
  apis: [path.resolve(__dirname, './router/index.js')],
};

const specs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app; // Exporter l'instance app pour d'autres fichier comme server.js.
