/* eslint-disable max-len */
import express from 'express';

import authController from '../controllers/authController.js';
import assetController from '../controllers/assetController.js';
import portfolioController from '../controllers/portfolioController.js';
import userController from '../controllers/userController.js';
import { errorHandler } from '../middlewares/error.middleware.js';
import tokenMiddleware from '../utils/authValidation/tokenMiddleware.js';
import statController from '../controllers/statController.js';
import dashboardController from '../controllers/dashboardController.js';

import {
  validateRegister, validateLogin, validatePortfolio, validateAddAsset,
} from '../validation/validator.middleware.js';

const router = express.Router();
/**
 * @swagger
 * /:
 *   get:
 *     description: Root API endpoint, thank you for using oInvest API.
 *     responses:
 *       '201':
 *         description: Greeting message.
 */
router.get('/', (_, res) => {
  res.send('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
});
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/api/register', validateRegister, authController.register);
/**
 * @swagger
 * /api/login:
 *   post:
 *     description: Login
 *     responses:
 *       '201':
 *         description: User logged successfully.
 */
router.post('/api/login', validateLogin, authController.login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: User infos.
 *     responses:
 *       '201':
 *         description: User found in database.
 */
router.get('/api/users', tokenMiddleware, userController.getProfile);

// ALL ASSETS
/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     description: delete a profile, and all concerned portfolios, transactions and assets.
 *     responses:
 *       '201':
 *         description: Profile deleted.
 */
router.delete('/api/users/delete', tokenMiddleware, userController.deleteProfile);

/**
 * @swagger
 * /api/assets:
 *   get:
 *     description: Find all assets.
 *     responses:
 *       '201':
 *         description: All assets successfully retrieved.
 */
router.get('/api/assets', tokenMiddleware, assetController.getAllAssets);

/**
 * @swagger
 * /api/portfolios:
 *   post:
 *     description: Create a new portfolio.
 *     responses:
 *       '201':
 *         description: New portfolio successfully added.
 */
router.post('/api/portfolios', tokenMiddleware, validatePortfolio, portfolioController.createPortfolio);
/**
 * @swagger
 * /api/portfolios/:id/addasset:
 *   post:
 *     description: Add asset to portfolio and update transaction history.
 *     responses:
 *       '201':
 *         description: Transaction successful - updated in Portfolio and Transaction History.
 */
router.post('/api/portfolios/:id/addasset', tokenMiddleware, validateAddAsset, assetController.addAssetToPortfolio);

/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     description: Find all portfolios.
 *     responses:
 *       '201':
 *         description: Successfully retrieved all portfolios.
 */
router.get('/api/portfolios', tokenMiddleware, portfolioController.getAllPortfolios);
/**
 * @swagger
 * /api/portfolios/:id:
 *   put:
 *     description: Update a portfolio.
 *     responses:
 *       '201':
 *         description: Portfolio updated successfully.
 */
router.put('/api/portfolios/:id', tokenMiddleware, validatePortfolio, portfolioController.updatePortfolio);
/**
 * @swagger
 * /api/portfolios/:id:
 *   delete:
 *     description: Delete portfolio.
 *     responses:
 *       '201':
 *         description: Portfolio deleted successfully, as well as related transactions, and portfolio assets.
 */
router.delete('/api/portfolios/:id', tokenMiddleware, portfolioController.deletePortfolio);
/**
 * @swagger
 * /api/portfolios/:id/deleteasset:
 *   delete:
 *     description: on delete un asset, on mets à jour le remaining_quantity dans portfolio_asset, on efface les transactions concernées, et on mets à jour le total_invested dans la table portfolio.
 *     responses:
 *       '201':
 *         description: Quantity to remove exceeds the available quantity in the portfolio.
 */

router.delete('/api/portfolios/:id/deleteasset', tokenMiddleware, assetController.deleteAssetFromPortfolio);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     description: Get stats for all portfolios of a user
 *     responses:
 *       '201':
 *         description: All portfolios and their statistics found for a user.
 */
router.get('/api/stats', tokenMiddleware, statController.allPortfoliosStats);
/**
 * @swagger
 * /api/portfolios/:id:
 *   get:
 *     description: Get stats for a specific portfolio of a user
 *     responses:
 *       '201':
 *         description: Successful response with the specific portfolio stats
 */
router.get('/api/portfolios/:id', tokenMiddleware, statController.getOnePortfolioStats);
/**
 * @swagger
 * /api/stats/ranking:
 *   get:
 *     description: Calculate the top and worst performer portfolios
 *     responses:
 *       '201':
 *         description: Found top and worst performer portfolios.
 */
router.get('/api/stats/ranking', tokenMiddleware, statController.getRanking);

/**
 * @swagger
 * /api/portfolios/:id/avg:
 *   get:
 *     description: Get the average purchase price of a portfolio
 *     responses:
 *       '201':
 *         description: Average asset's purchase price calculated successfully
 */
router.get('/api/portfolios/:id/avg', tokenMiddleware, statController.averagePurchasePrice);
/**
 * @swagger
 * /api/stats/portfolios/weight:
 *   get:
 *     description: Find all portfolios for a user and their valuation.
 *     responses:
 *       '201':
 *         description: All portfolios for user and their valuation found.
 */

router.get('/api/stats/portfolios/weight', tokenMiddleware, statController.getPortfolioWeight);
/**
 * @swagger
 * /api/portfolios/:id/assets/perf:
 *   get:
 *     description: Calculate Profit&Loss and ROI for each asset.
 *     responses:
 *       '201':
 *         description: Found Profit&Loss and ROI for each asset.
 */
router.get('/api/portfolios/:id/assets/perf', tokenMiddleware, statController.getProfitLossAsset);

router.get('/dashboard', tokenMiddleware, dashboardController.updateStocksHourly);

router.use(errorHandler);

export default router;
