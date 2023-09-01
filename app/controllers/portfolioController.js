import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';

const portfolioController = {

  // START CREATE PORTFOLIO

  createPortfolio: async (req, res) => {
    const { name, strategy } = req.body;
    const userId = req.user.id; // permets de passer par le middleware et vérifier le token

    try {
      const newPortfolio = await Portfolio.create({
        name,
        strategy,
        userId,
      });
      return res.status(200).json({ message: 'New portfolio successfully added', newPortfolio });
    } catch (err) {
      return res.status(500).json({ error: 'Error creating new portfolio' });
    }
  },

  // END CREATE PORTFOLIO

  // START UPDATE PORTFOLIO

  updatePortfolio: async (req, res) => {
    const { name, strategy } = req.body;
    const portfolioId = req.params.id;
    const userId = req.user.id;

    try {
      const portfolio = await Portfolio.findOne({
        where: { id: portfolioId, userId },
      });
      if (!portfolio) {
        return res.status(404).json({ error: 'Unauthorized action - portfolio not found or does not belong to the user' });
      }

      portfolio.name = name || portfolio.name;
      portfolio.strategy = strategy || portfolio.strategy;
      await portfolio.save();

      return res.status(200).json({ message: 'Portfolio updated successfully', portfolio });
    } catch (err) {
      return res.status(500).json({ error: 'Error updating portfolio' });
    }
  },

  // END UPDATE PORTFOLIO

  // START DELETE PORTFOLIO

  deletePortfolio: async (req, res) => {
    const portfolioId = req.params.id;
    const userId = req.user.id;
    try {
      const portfolio = await Portfolio.findOne({
        where: { id: portfolioId, userId },
      });
      if (!portfolio) {
        return res.status(404).json({ error: 'Unauthorized action - portfolio not found or does not belong to the user' });
      }
      const portfolioAssetToDelete = await PortfolioAsset.findAll({
        where: { portfolio_id: portfolioId },
      });
      await Transaction.destroy({
        where: { portfolio_asset_id: portfolioAssetToDelete },
      });
      // Delete related portfolio assets first
      await PortfolioAsset.destroy({
        where: { portfolio_id: portfolioId },
      });
      await portfolio.destroy();
      return res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error deleting portfolio' });
    }
  },

  // START GET ALL PORTFOLIOS

  getAllPortfolios: async (req, res) => {
    const userId = req.user.id;
    try {
      const allPortfolios = await Portfolio.findAll({
        where: { user_id: userId },
      });
      if (!allPortfolios) {
        res.status(404).json({ error: 'No portfolios for this user' });
      }
      return res.status(201).json({ message: 'Successfully retrieved all portfolios', allPortfolios });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving all portfolios' });
    }
  },

  // END GET ALL PORTFOLIOS

};

export default portfolioController;
