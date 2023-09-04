/* eslint-disable max-len */
import express from 'express';
import authController from '../controllers/authController.js';
import assetController from '../controllers/assetController.js';
import portfolioController from '../controllers/portfolioController.js';
import userController from '../controllers/userController.js';
import { errorHandler } from '../middlewares/error.middleware.js';
import tokenMiddleware from '../utils/authValidation/tokenMiddleware.js';
import statController from '../controllers/statController.js';

const router = express.Router();
/**
 * @swagger
 * /:
 *   get:
 *     description: Root API endpoint, thank you for using oInvest API.
 *     responses:
 *       '200':
 *         description: Greeting message.
 */
router.get('/', (_, res) => {
  res.send('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
});
/**
 * @swagger
 * /api/register:
 *   post:
 *     description: Register a new user
 *     responses:
 *       '200':
 *         description: User registered successfully.
 */
router.post('/api/register', authController.register);
/**
 * @swagger
 * /api/login:
 *   post:
 *     description: Login
 *     responses:
 *       '200':
 *         description: User logged successfully.
 */
router.post('/api/login', authController.login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: User infos.
 *     responses:
 *       '200':
 *         description: User found in database.
 */
router.get('/api/users', tokenMiddleware, userController.getProfile);

/**
 * @swagger
 * /api/assets:
 *   get:
 *     description: Find all assets.
 *     responses:
 *       '200':
 *         description: All assets successfully retrieved.
 */
router.get('/api/assets', tokenMiddleware, assetController.getAllAssets);

/**
 * @swagger
 * /api/portfolios:
 *   post:
 *     description: Create a new portfolio.
 *     responses:
 *       '200':
 *         description: New portfolio successfully added.
 */
router.post('/api/portfolios', tokenMiddleware, portfolioController.createPortfolio);
/**
 * @swagger
 * /api/portfolios/:id/addasset:
 *   post:
 *     description: Add asset to portfolio and update transaction history.
 *     responses:
 *       '200':
 *         description: Transaction successful - updated in Portfolio and Transaction History.
 */
router.post('/api/portfolios/:id/addasset', tokenMiddleware, assetController.addAssetToPortfolio);
/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     description: Find all portfolios.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all portfolios.
 */
router.get('/api/portfolios', tokenMiddleware, portfolioController.getAllPortfolios);
/**
 * @swagger
 * /api/portfolios/:id:
 *   put:
 *     description: Update a portfolio.
 *     responses:
 *       '200':
 *         description: Portfolio updated successfully.
 */
router.put('/api/portfolios/:id', tokenMiddleware, portfolioController.updatePortfolio);
/**
 * @swagger
 * /api/portfolios/:id:
 *   delete:
 *     description: Delete portfolio.
 *     responses:
 *       '200':
 *         description: Portfolio deleted successfully, as well as related transactions, and portfolio assets.
 */
router.delete('/api/portfolios/:id', tokenMiddleware, portfolioController.deletePortfolio);
router.delete('/api/portfolios/:id/deleteasset', tokenMiddleware, assetController.deleteAssetFromPortfolio);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     description: Get stats for all portfolios of a user
 *     responses:
 *       '200':
 *         description: All portfolios and their statistics found for a user.
 */
router.get('/api/stats', tokenMiddleware, statController.allPortfoliosStats);
/**
 * @swagger
 * /api/portfolios/:id:
 *   get:
 *     description: Get stats for a specific portfolio of a user
 *     responses:
 *       '200':
 *         description: Successful response with the specific portfolio stats
 */
router.get('/api/stats/ranking', tokenMiddleware, statController.getRanking);
router.get('/api/portfolios/:id', tokenMiddleware, statController.getOnePortfolioStats);
/**
 * @swagger
 * /api/portfolios/:id/avg:
 *   get:
 *     description: Get the average purchase price of a portfolio
 *     responses:
 *       '200':
 *         description: Average asset's purchase price calculated successfully
 */
router.get('/api/portfolios/:id/avg', tokenMiddleware, statController.averagePurchasePrice);
/**
 * @swagger
 * /api/stats/portfolios/weight:
 *   get:
 *     description: Find all portfolios for a user and their valuation.
 *     responses:
 *       '200':
 *         description: All portfolios for user and their valuation found.
 */

router.get('/api/portfolios/:id/assets/perf', tokenMiddleware, statController.getProfitLossAsset);
router.get('/api/stats/portfolios/weight', tokenMiddleware, statController.getPortfolioWeight);

router.use(errorHandler);

export default router;
