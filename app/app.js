// Import des modules
import express from 'express';
import cors from 'cors'; // MW qui active cors

// import router from './router/index.js'; // Importation des routes de l'application.

const app = express(); // Init de l'app Express.

// MW qui permet au serveur de traiter les req avec du contenu JSON.
app.use(express.json());

// MW qui permet au serveur de traiter les req avec du contenu sous forme URL encodée.
app.use(express.urlencoded({ extended: true }));

// Activation du MW CORS. car front et backend hébergés séparément.
app.use(cors(process.env.CORS_DOMAINS ?? 'localhost'));

// Utilisation des routes définies dans le router importé.
// app.use(router);

export default app; // Exporter l'instance app pour d'autres fichier comme server.js.
