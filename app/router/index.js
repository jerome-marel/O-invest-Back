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
// Routes pour l'accueil
router.get('/api/', dashboardController.welcomeUser);
router.post('/api/portfolios', tokenMiddleware, portfolioController.createPortfolio);
router.get('/api/portfolios', tokenMiddleware, portfolioController.getAllPortfolios);
router.get('/api/portfolios/:id', tokenMiddleware, portfolioController.getOnePortfolio);
router.get('/api/portfolios/:id/roi', tokenMiddleware, portfolioController.getROI);
// Routes CRUD:
router.put('/api/portfolios/:id', tokenMiddleware, portfolioController.updatePortfolio);
router.delete('/api/portfolios/:id', tokenMiddleware, portfolioController.deletePortfolio);

// Routes pour la liste des assets
router.get('/api/assets', assetController.getAllAssets);
// Route pour ajouter asset à un portfolio
router.post('/api/portfolios/:id/addasset', tokenMiddleware, assetController.addAssetToPortfolio);
router.use(errorHandler);
export default router;
