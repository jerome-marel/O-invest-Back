import express from 'express';
import authController from '../controllers/authController.js';
import newAssetController from '../controllers/newAssetController.js';
import portfolioController from '../controllers/portfolioController.js';
import userController from '../controllers/userController.js';
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
router.get('/api/users', tokenMiddleware, userController.getProfile);

// PORTOFOLIOS
router.post('/api/portfolios', tokenMiddleware, portfolioController.createPortfolio);
router.get('/api/portfolios', tokenMiddleware, portfolioController.getAllPortfolios);
router.get('/api/portfolios/:id', tokenMiddleware, portfolioController.getOnePortfolioStats);

// GET AVERAGE
router.get('/api/portfolios/:id/avg', tokenMiddleware, portfolioController.averagePurchasePrice);

// router.get('/api/portfolios/:id/roi', tokenMiddleware, portfolioController.getROI);
// Routes CRUD:
router.put('/api/portfolios/:id', tokenMiddleware, portfolioController.updatePortfolio);
router.delete('/api/portfolios/:id', tokenMiddleware, portfolioController.deletePortfolio);

// Routes pour la liste des assets
router.get('/api/assets', newAssetController.getAllAssets);

// Route pour ajouter asset à un portfolio
router.post('/api/portfolios/:id/addasset', tokenMiddleware, newAssetController.addAssetToPortfolio);

router.use(errorHandler);
export default router;
