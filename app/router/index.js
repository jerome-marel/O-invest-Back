import express from 'express';
import assetController from '../controllers/assetController.js';
import authController from '../controllers/authController.js';
import dashboardController from '../controllers/dashboardController.js';
import portfolioController from '../controllers/portfolioController.js';
import { errorHandler } from '../middlewares/error.middleware.js';
import tokenMiddleware from '../utils/authValidation/tokenMiddleware.js';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
});

// Route pour l'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Routes pour le portfolio
router.get('/dashboard', dashboardController.welcomeUser);
router.post('/dashboard', tokenMiddleware, portfolioController.createPortfolio);

// Routes pour la liste des assets
router.get('/dashboard/allassets', assetController.getAllAssets);

router.use(errorHandler);

export default router;
