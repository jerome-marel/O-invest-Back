import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';

const portfolioController = {
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
  // update a portfolio
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

  // delete portfolio
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
      await portfolio.destroy();
      return res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Error deleting portfolio' });
    }
  },

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

  getOnePortfolio: async (req, res) => {
    const { id } = req.params;
    try {
      const portfolio = await Portfolio.findByPk(id);
      if (!portfolio) {
        return res.status(404).json({ error: 'Invalid portfolio id entered - portfolio does not exist' });
      }
      return res.status(200).json({ message: 'Successfully retrieved portfolio', portfolio });
    } catch (err) {
      return res.status(500).json({ error: 'Error in retrieving portfolio, please try again later' });
    }
  },

  getROI: async (req, res) => {
    const userId = req.user.id;
    const portfolioId = req.params.id;

    try {
      const userPortfolio = await Portfolio.findOne({
        where: { id: portfolioId, user_id: userId },
      });

      if (!userPortfolio) {
        return res.status(404).json({ error: 'Unauthorized action - portfolio not found or does not belong to the user' });
      }
      const roi = await Transaction.findAll({
        where: { portfolioId },
      });
      if (!roi) {
        return res.status(404).json({ error: 'No transactions found, please add asset to your portfolio' });
      }
      // eslint-disable-next-line max-len
      const totalTransactedSum = roi.reduce((sum, transaction) => sum + parseFloat(transaction.totalTransacted), 0);
      return res.status(200).json({
        message: 'Found all transactions', roi, userId, totalTransactedSum,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error, could not display ROI' });
    }
  },

};

export default portfolioController;
