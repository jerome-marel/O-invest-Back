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
router.post('/api/register', authController.register);
router.post('/api/login', authController.login);

// Routes pour le portfolio
router.get('/dashboard', dashboardController.welcomeUser);
router.post('/dashboard/portfolio', tokenMiddleware, portfolioController.createPortfolio);
router.get('/dashboard/allportfolio', tokenMiddleware, portfolioController.getAllPortfolios);
router.get('/dashboard/portfolio/:id', tokenMiddleware, portfolioController.getOnePortfolio);
router.get('/dashboard/portfolio/:id/roi', tokenMiddleware, portfolioController.getROI);

// Routes pour la liste des assets
router.get('/dashboard/allassets', assetController.getAllAssets);

// Route pour ajouter asset à un portfolio
router.post('/portfolio/:id/addasset', tokenMiddleware, assetController.addAssetToPortfolio);

router.use(errorHandler);

export default router;
