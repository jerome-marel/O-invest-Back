import axios from 'axios';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import logger from '../utils/logger.js';

const userTimestampsCache = new Map();

const dashboardController = {

  updateStocksHourly: async (req, res) => {
    const userId = req.user.id;

    const lastExecutionTimestamp = userTimestampsCache.get(userId);

    if (!lastExecutionTimestamp || Date.now() - lastExecutionTimestamp >= 120000) {
      try {
        const allPortfolios = await Portfolio.findAll({
          where: { userId },
        });

        if (allPortfolios.length === 0) {
          return res.status(200).json({ message: 'No portfolios found for this user.' });
        }

        const portfolioIds = allPortfolios.map((portfolio) => portfolio.id);

        const portfolioAssets = await PortfolioAsset.findAll({
          where: { portfolioId: portfolioIds },
        });

        const apiKey = process.env.TWELVEDATA_API_KEY;

        const updatedAssetData = [];

        await Promise.all(portfolioAssets.map(async (asset) => {
          const realTimeURL = `https://api.twelvedata.com/price?symbol=${asset.symbol}&apikey=${apiKey}`;
          const resCurrentPrice = await axios.get(realTimeURL);
          const currentPriceData = parseFloat(resCurrentPrice.data.price);

          await asset.update({ historicPrice: currentPriceData });

          updatedAssetData.push({
            symbol: asset.symbol,
            historicPrice: currentPriceData,
          });
        }));

        userTimestampsCache.set(userId, Date.now());

        return res.status(200).json({
          message: 'Asset prices updated successfully',
          updatedAssetData,
        });
      } catch (error) {
        logger.info(error);
        return res.status(200).json({ message: 'Error updating asset prices' });
      }
    }
    return res.status(200).json({ message: 'Asset prices are up to date' });
  },
};

export default dashboardController;
