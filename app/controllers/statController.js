// import axios from 'axios';
import '../utils/env.load.js';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';

// async function fetchHistoricalPrice(assetId, date) {
//   // Fetch from Twelve Data API
//   const response = await axios.get(`https://api.twelvedata.com/stocks?symbol=${assetId}&date=${date}`);
//   // 'https://api.twelvedata.com/stocks?country=us&exchange=nasdaq&type=common-stock&mic_code=xngs'
//   return response.data.price;
// }
// async function fetchCurrentPrice(assetId) {
//   // Fetch from Twelve Data API
//   const response = await axios.get(`https://api.twelvedata.com/stocks?symbol=${assetId}`);
//   return response.data.price;
// }
const statController = {

  allPortfoliosStats: async (req, res) => {
    const userId = req.user.id;

    try {
      const allPortfolios = await Portfolio.findAll({
        where: { userId },
      });
      if (!allPortfolios) {
        return res.status(404).json({ error: 'No portfolios found for current user' });
      }

      const totalInvestedPortfolios = allPortfolios.reduce((total, portfolio) => {
        const totalInvested = parseFloat(portfolio.totalInvested);
        return Number.isNaN(totalInvested) ? total : total + totalInvested;
      }, 0);
      const totalInvestedPortfoliosRounded = totalInvestedPortfolios.toFixed(2);
      const totalInvestedPortfoliosToNumber = Number(totalInvestedPortfoliosRounded);
      return res.status(200).json({
        message: 'All portfolios for user found',
        allPortfolios,
        totalInvestedPortfoliosToNumber,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error - could not retrieve user portfolios' });
    }
  },

  getOnePortfolioStats: async (req, res) => {
    const userId = req.user.id;
    const portfolioId = req.params.id;

    try {
      // METHOD TO SHOW PORTFOLIO (name, strategy, totalInvested)

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

      // METHOD TO SHOW PORTFOLIO_ASSETS (symbol, name, remainingQuantity, historicPrice)

      const userPortfolioAssets = await PortfolioAsset.findAll({
        where: { portfolio_id: portfolioId },
      });

      const totalInvestedForROI = userPortfolio.totalInvested;

      const currentPriceData = {};

      userPortfolioAssets.forEach((asset) => {
        const { symbol } = asset;
        const historicPrice = parseFloat(asset.historicPrice);

        currentPriceData[symbol] = {
          price: parseFloat(historicPrice.toFixed(2)), // Format to 2 decimal places
        };
      });

      try {
        let portfolioValuation = 0;

        if (currentPriceData.price) {
          const singleAssetPrice = parseFloat(currentPriceData.price);
          // eslint-disable-next-line max-len
          portfolioValuation = singleAssetPrice * parseFloat(userPortfolioAssets[0].remainingQuantity);
        } else {
          userPortfolioAssets.forEach((asset) => {
            const { symbol, remainingQuantity } = asset;
            if (currentPriceData[symbol] && currentPriceData[symbol].price) {
              const currentPrice = parseFloat(currentPriceData[symbol].price);
              portfolioValuation += currentPrice * parseFloat(remainingQuantity);
            }
          });
        }

        portfolioValuation = Number(portfolioValuation.toFixed(2));

        // eslint-disable-next-line max-len
        let portfolioROIPercent = 0;
        // eslint-disable-next-line max-len
        portfolioROIPercent = ((portfolioValuation - totalInvestedForROI) / totalInvestedForROI) * 100;
        portfolioROIPercent = Number(portfolioROIPercent.toFixed(2));

        const profitAndLoss = Number(portfolioValuation - totalInvestedForROI);
        const profitAndLossRounded = parseFloat(profitAndLoss.toFixed(2));

        return res.status(200).json({
          message: 'Found all transactions',
          portfolio,
          userPortfolioAssets,
          totalInvestedForROI,
          currentPriceData,
          portfolioValuation,
          portfolioROIPercent,
          profitAndLossRounded,
        });
      } catch (priceError) {
        return res.status(500).json({ error: 'Error fetching current price data' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching portfolio data' });
    }
  },

  averagePurchasePrice: async (req, res) => {
    const portfolioId = req.params.id;

    try {
      const transactions = await Transaction.findAll({
        where: { portfolioId },
      });

      const averagePrices = {};

      transactions.forEach((transaction) => {
        const { symbol } = transaction;
        const purchasePrice = parseFloat(transaction.assetPrice);

        if (averagePrices[symbol]) {
          averagePrices[symbol].totalPrice += purchasePrice;
          averagePrices[symbol].count += 1;
        } else {
          averagePrices[symbol] = {
            totalPrice: purchasePrice,
            count: 1,
          };
        }
      });

      Object.keys(averagePrices).forEach((symbol) => {
        const { totalPrice, count } = averagePrices[symbol];
        averagePrices[symbol] = totalPrice / count;
      });

      return res.status(200).json({
        message: 'Average purchase prices calculated successfully',
        transactions,
        averagePrices,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error calculating average purchase prices' });
    }
  },

};
export default statController;
