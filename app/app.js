/* eslint-disable no-underscore-dangle */
// Import des modules
import express from 'express';
import cors from 'cors'; // MW qui active cors
import setupSwagger from './utils/api.doc.js';

import router from './router/index.js'; // Import routes

const app = express(); // Init Express app

// use Swagger config
setupSwagger(app);

// MW allowing server to use json
app.use(express.json());

// MW allowing server to use url-encoded
app.use(express.urlencoded({ extended: true }));

// Activate CORS because our back and front end are seperated
app.use(cors(process.env.CORS_DOMAINS ?? 'localhost'));

// use routes from imported router
app.use(router);

// export of the app
export default app;
