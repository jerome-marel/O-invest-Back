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

      const portfolioIds = allPortfolios.map((portfolio) => portfolio.id);

      const allPortfolioAssets = await PortfolioAsset.findAll({
        where: { portfolioId: portfolioIds },
      });

      const currentPriceData = {};

      allPortfolioAssets.forEach((asset) => {
        const { symbol, historicPrice } = asset;

        currentPriceData[symbol] = {
          price: historicPrice,
        };
      });

      try {
        let portfolioValuation = 0;

        if (currentPriceData.price) {
          const singleAssetPrice = parseFloat(currentPriceData.price);
          // eslint-disable-next-line max-len
          portfolioValuation = singleAssetPrice * parseFloat(allPortfolioAssets[0].remainingQuantity);
        } else {
          allPortfolioAssets.forEach((asset) => {
            const { symbol, remainingQuantity } = asset;
            if (currentPriceData[symbol] && currentPriceData[symbol].price) {
              const currentPrice = parseFloat(currentPriceData[symbol].price);
              portfolioValuation += currentPrice * parseFloat(remainingQuantity);
            }
          });
        }

        let allPortfolioROIPercent = 0;

        // eslint-disable-next-line max-len
        allPortfolioROIPercent = ((portfolioValuation - totalInvestedPortfolios) / totalInvestedPortfolios) * 100;

        const profitAndLoss = (portfolioValuation - totalInvestedPortfolios);

        return res.status(200).json({
          message: 'All portfolios and their statistics found for a user',
          allPortfolios,
          totalInvestedPortfolios,
          allPortfolioAssets,
          portfolioValuation,
          allPortfolioROIPercent,
          profitAndLoss,
        });
      } catch (err) {
        return res.status(500).json({ error: 'Error calculating portfolio valuation and ROI' });
      }
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
          message: 'Successful response with the specific portfolio stats',
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
        const { symbol, assetPrice, quantity } = transaction;

        if (!averagePrices[symbol]) {
          averagePrices[symbol] = {
            totalPrice: 0,
            totalQuantity: 0,
          };
        }
        const totalSpent = parseFloat(assetPrice) * quantity;

        averagePrices[symbol].totalPrice += totalSpent;
        averagePrices[symbol].totalQuantity += quantity;
      });

      Object.keys(averagePrices).forEach((symbol) => {
        const { totalPrice, totalQuantity } = averagePrices[symbol];
        averagePrices[symbol] = parseFloat((totalPrice / totalQuantity).toFixed(2));
      });
      return res.status(200).json({
        message: 'Average asset purchase price calculated successfully',
        averagePrices,
        transactions,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error calculating average purchase prices' });
    }
  },

  getPortfolioWeight: async (req, res) => {
    const userId = req.user.id;

    try {
      const allPortfolios = await Portfolio.findAll({
        where: { userId },
      });

      if (!allPortfolios || allPortfolios.length === 0) {
        return res.status(404).json({ error: 'No portfolios found for current user' });
      }

      const portfolioIds = allPortfolios.map((portfolio) => portfolio.id);
      const allPortfolioAssets = await PortfolioAsset.findAll({
        where: { portfolioId: portfolioIds },
      });
      const portfolioValuations = allPortfolios.map((portfolio) => {
        // eslint-disable-next-line max-len
        const portfolioAssets = allPortfolioAssets.filter((asset) => asset.portfolioId === portfolio.id);

        const portfolioValuation = portfolioAssets.reduce((total, asset) => {
          const assetValuation = asset.historicPrice * asset.remainingQuantity;
          return total + assetValuation;
        }, 0);

        // Return the portfolio name and total valuation
        return {
          portfolioName: portfolio.name,
          totalValuation: parseFloat(portfolioValuation),
        };
      });

      return res.status(200).json({
        message: 'All portfolios for user and their valuation found',
        allPortfolios,
        portfolioValuations,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error - could not retrieve user portfolios' });
    }
  },

  getProfitLossAsset: async (req, res) => {
    const portfolioId = req.params.id;

    try {
      const portfolioAssets = await PortfolioAsset.findAll({
        where: { portfolioId },
      });

      const transactions = await Transaction.findAll({
        where: { portfolioId },
      });

      const oneAssetProfitLoss = portfolioAssets.map((asset) => {
        const matchingTransaction = transactions.find(
          (transaction) => transaction.symbol === asset.symbol,
        );

        if (matchingTransaction) {
          const { assetPrice } = matchingTransaction;
          const { historicPrice } = asset;
          const { remainingQuantity } = asset;

          const priceDifference = historicPrice - assetPrice;
          const assetProfitLoss = priceDifference * remainingQuantity;
          const assetROIPercent = ((historicPrice - assetPrice) / assetPrice) * 100;

          return {
            symbol: asset.symbol,
            assetProfitLoss,
            assetROIPercent,
          };
        }
        return null;
      }).filter(Boolean);

      return res.status(200).json({
        message: 'Found all ROI for assets',
        oneAssetProfitLoss,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error, please try again later' });
    }
  },

  getRanking: async (req, res) => {
    const userId = req.user.id;

    try {
      const allPortfolios = await Portfolio.findAll({
        where: { userId },
      });

      if (allPortfolios.length === 0) {
        return res.status(404).json({ message: 'No portfolios found for this user.' });
      }

      const portfolioIds = allPortfolios.map((portfolio) => portfolio.id);

      const portfolioAssets = await PortfolioAsset.findAll({
        where: { portfolioId: portfolioIds },
      });

      const symbolsGraph = portfolioAssets.map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
      }));

      const transactions = await Transaction.findAll({
        where: { portfolioId: portfolioIds },
      });

      const oneAssetProfitLoss = portfolioAssets.map((asset) => {
        try {
          const matchingTransaction = transactions.find(
            (transaction) => transaction.symbol === asset.symbol,
          );

          if (matchingTransaction) {
            const { assetPrice } = matchingTransaction;
            const { historicPrice } = asset;
            const { remainingQuantity } = asset;

            // Calculate the profit or loss for the asset
            const priceDifference = historicPrice - assetPrice;
            const assetProfitLoss = priceDifference * remainingQuantity;
            const assetROIPercent = ((historicPrice - assetPrice) / assetPrice) * 100;

            return {
              symbol: asset.symbol,
              assetProfitLoss,
              assetROIPercent,
            };
          }
        } catch (err) {
          return res.status(404).json({
            error: 'Error calculating profit and loss',
            err,
          });
        }

        return null;
      }).filter(Boolean);

      oneAssetProfitLoss.sort((a, b) => b.assetROIPercent - a.assetROIPercent);

      const topPerformer = oneAssetProfitLoss.slice(0, 1);
      const worstPerformer = oneAssetProfitLoss.slice(-1);

      return res.status(200).json({
        message: 'Found portfolios',
        topPerformer,
        worstPerformer,
        symbolsGraph,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again later' });
    }
  },

};

export default statController;
