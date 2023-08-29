import axios from 'axios';
// import '../app/utils/env.load.js';
import User from '../models/User.js';
// import Portfolio from '../models/Portfolio.js';
// import Assetlist from '../models/Assetlist.js';
// import PortfolioAsset from '../models/PortfolioAsset.js';
// import Transaction from '../models/Transaction.js';

async function fetchHistoricalPrice(assetId, date) {
  // Fetch from Twelve Data API
  const response = await axios.get(`https://api.twelvedata.com/stocks?symbol=${assetId}&date=${date}`);
  // 'https://api.twelvedata.com/stocks?country=us&exchange=nasdaq&type=common-stock&mic_code=xngs'
  return response.data.price;
}
async function fetchCurrentPrice(assetId) {
  // Fetch from Twelve Data API
  const response = await axios.get(`https://api.twelvedata.com/stocks?symbol=${assetId}`);
  return response.data.price;
}
const dashboardController = {
  welcomeUser: async (_, res) => {
    try {
      const currentUser = await User.findOne({
        where: {
          id: 3,
        },
      });
      if (currentUser) {
        const welcomeMessage = `Welcome, ${currentUser.firstName} ${currentUser.lastName}!`;
        return res.status(200).json({ message: welcomeMessage });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  // test Razack assets
  // One asset stats
  assetPriceAtBuy: async (req, res) => {
    const { assetId, purchaseDatetime } = req.body;
    // Fetch historical price based on purchaseDatetime and assetId from Twelve Data API
    const historicalPrice = await fetchHistoricalPrice(assetId, purchaseDatetime);
    res.json({ priceAtBuy: historicalPrice });
  },
  assetPriceNow: async (req, res) => {
    const { assetId } = req.body;
    const currentPrice = await fetchCurrentPrice(assetId);
    res.json({ priceNow: currentPrice });
  },
  assetProfitAndLoss: async (req, res) => {
    const { assetId, purchaseDatetime, quantity } = req.body;
    const priceAtBuy = await fetchHistoricalPrice(assetId, purchaseDatetime);
    const priceNow = await fetchCurrentPrice(assetId);
    const profitAndLoss = (priceNow - priceAtBuy) * quantity;
    res.json({ profitAndLoss });
  },
  // One portfolio stats
  // All Portfolios stats
};
export default dashboardController;
