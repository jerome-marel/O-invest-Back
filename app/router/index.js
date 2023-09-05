import express from 'express';
import authController from '../controllers/authController.js';
import assetController from '../controllers/assetController.js';
import portfolioController from '../controllers/portfolioController.js';
import userController from '../controllers/userController.js';
import { errorHandler } from '../middlewares/error.middleware.js';
import tokenMiddleware from '../utils/authValidation/tokenMiddleware.js';
import statController from '../controllers/statController.js';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
});
// Route pour l'authentification
router.post('/api/register', authController.register);
router.post('/api/login', authController.login);

// Routes pour l'accueil
router.get('/api/users', tokenMiddleware, userController.getProfile);

// ROUTES CRUD USER
router.delete('/api/users/delete', tokenMiddleware, userController.deleteProfile);

// ALL ASSETS
router.get('/api/assets', tokenMiddleware, assetController.getAllAssets);

// PORTOFOLIOS
router.post('/api/portfolios', tokenMiddleware, portfolioController.createPortfolio);
router.post('/api/portfolios/:id/addasset', tokenMiddleware, assetController.addAssetToPortfolio);
router.get('/api/portfolios', tokenMiddleware, portfolioController.getAllPortfolios);
router.put('/api/portfolios/:id', tokenMiddleware, portfolioController.updatePortfolio);
router.delete('/api/portfolios/:id', tokenMiddleware, portfolioController.deletePortfolio);
router.delete('/api/portfolios/:id/deleteasset', tokenMiddleware, assetController.deleteAssetFromPortfolio);

// STATS
router.get('/api/stats', tokenMiddleware, statController.allPortfoliosStats);
router.get('/api/stats/ranking', tokenMiddleware, statController.getRanking);
router.get('/api/portfolios/:id', tokenMiddleware, statController.getOnePortfolioStats);
router.get('/api/portfolios/:id/avg', tokenMiddleware, statController.averagePurchasePrice);
router.get('/api/portfolios/:id/assets/perf', tokenMiddleware, statController.getProfitLossAsset);
router.get('/api/stats/portfolios/weight', tokenMiddleware, statController.getPortfolioWeight);

router.use(errorHandler);

export default router;
