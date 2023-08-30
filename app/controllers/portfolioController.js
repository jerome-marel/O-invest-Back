import axios from 'axios';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';
// import PortfolioAsset from '../models/PortfolioAsset.js';

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
    const userId = req.user.id;
    const portfolioId = req.params.id;
    try {
      const userPortfolio = await Portfolio.findOne({
        where: { id: portfolioId, user_id: userId },
      });

      if (!userPortfolio) {
        return res.status(404).json({ error: 'Unauthorized action - portfolio not found or does not belong to the user' });
      }
      const portfolio = await Portfolio.findByPk(portfolioId);
      if (!portfolio) {
        return res.status(404).json({ error: 'Invalid portfolio id entered - portfolio does not exist' });
      }
      const userPortfolioAssets = await PortfolioAsset.findAll({
        where: { portfolio_id: portfolioId },
      });

      return res.status(200).json({
        message: 'Successfully retrieved portfolio', portfolio, userPortfolioAssets,
      });
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

      const totalInvestedForROI = userPortfolio.totalInvested;

      try {
        const userPortfolioAssets = await PortfolioAsset.findAll({
          where: { portfolio_id: portfolioId },
        });
        const uniqueSymbolSet = new Set(userPortfolioAssets.map((asset) => asset.symbol));
        const uniqueSymbolArray = [...uniqueSymbolSet];

        const apiKey = process.env.TWELVEDATA_API_KEY;
        const symbolList = uniqueSymbolArray.join(',');
        const realTimeURL = `https://api.twelvedata.com/price?symbol=${symbolList}&apikey=${apiKey}`;

        try {
          const resCurrentPrice = await axios.get(realTimeURL);
          const currentPriceData = resCurrentPrice.data;

          let portfolioValuation = 0;

          if (currentPriceData.price) {
            // Single asset case
            const singleAssetPrice = parseFloat(currentPriceData.price);
            portfolioValuation = singleAssetPrice * userPortfolioAssets[0].remainingQuantity;
          } else {
            // Multiple assets case
            userPortfolioAssets.forEach((asset) => {
              const { symbol, remainingQuantity } = asset;
              if (currentPriceData[symbol] && currentPriceData[symbol].price) {
                const currentPrice = parseFloat(currentPriceData[symbol].price);
                portfolioValuation += currentPrice * remainingQuantity;
              }
            });
          }

          portfolioValuation = Number(portfolioValuation.toFixed(2));

          // eslint-disable-next-line max-len
          let portfolioROIPercent = ((portfolioValuation - totalInvestedForROI) / totalInvestedForROI) * 100;

          portfolioROIPercent = Number(portfolioROIPercent.toFixed(2));

          const profitAndLoss = (Number(portfolioValuation) - Number(totalInvestedForROI));

          return res.status(200).json({
            message: 'Found all transactions',
            userId,
            totalInvestedForROI,
            uniqueSymbolArray,
            currentPriceData,
            portfolioValuation,
            portfolioROIPercent,
            profitAndLoss,
          });
        } catch (priceError) {
          console.log(priceError);
          return res.status(500).json({ error: 'Error fetching current price data' });
        }
      } catch (portfolioAssetsError) {
        return res.status(500).json({ error: 'Error fetching portfolio assets' });
      }
    } catch (portfolioError) {
      return res.status(500).json({ error: 'Error fetching user portfolio' });
    }
  },

};

export default portfolioController;
