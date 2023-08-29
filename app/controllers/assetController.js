import axios from 'axios';
import AssetList from '../models/AssetList.js';
// import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';

const assetController = {
  getAllAssets: async (req, res) => {
    try {
      const allAssets = await AssetList.findAll();

      const cleanedAssets = allAssets.map((asset) => ({
        id: asset.dataValues.id,
        symbol: asset.dataValues.symbol,
        name: asset.dataValues.name,
      }));

      return res.status(200).json({ message: 'All assets successfully retrieved', cleanedAssets });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving all assets' });
    }
  },

  addAssetToPortfolio: async (req, res) => {
    const userId = req.user.id;
    const portfolioId = req.params.id;
    const {
      symbol, purchaseDatetime, quantity, note,
    } = req.body;

    try {
      const asset = await AssetList.findOne({
        where: { symbol },
      });

      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      const userPortfolio = await Portfolio.findOne({
        where: { id: portfolioId, user_id: userId },
      });

      if (!userPortfolio) {
        return res.status(404).json({ error: 'Unauthorized action - portfolio not found or does not belong to the user' });
      }

      const apiKey = process.env.TWELVEDATA_API_KEY;
      const realTimeURL = `https://api.twelvedata.com/price?symbol=${asset.symbol}&apikey=${apiKey}`;
      const resCurrentPrice = await axios.get(realTimeURL);
      const currentPriceData = parseFloat(resCurrentPrice.data.price);

      // Create a new portfolio asset entry
      const newPortfolioAsset = await PortfolioAsset.create({
        userId,
        purchaseDatetime,
        remainingQuantity: quantity,
        name: asset.name,
        symbol: asset.symbol,
        portfolioId,
        historicPrice: currentPriceData,
      });

      const apiFormattedDate = purchaseDatetime.replace(' ', '%20').replace(':', '%3A');

      const apiUrl = `https://api.twelvedata.com/time_series?apikey=${apiKey}&interval=1min&symbol=${asset.symbol}&start_date=${apiFormattedDate}&end_date=${apiFormattedDate}&format=JSON`;
      const response = await axios.get(apiUrl);
      const priceData = response.data.values[0].open;

      const purchaseValue = priceData * quantity;

      // Add transaction history
      const newTransaction = await Transaction.create({
        assetId: asset.id,
        userId,
        portfolioId,
        portfolioAssetId: newPortfolioAsset.id,
        purchaseDatetime,
        assetPrice: priceData,
        quantity,
        totalTransacted: purchaseValue,
        note,
      });

      return res.status(201).json({
        message: 'Asset added to portfolio successfully',
        portfolioAsset: {
          id: newPortfolioAsset.id,
          asset: {
            symbol: asset.symbol,
            name: asset.name,
          },
          purchaseDatetime,
          quantity,
          purchaseValue,
        },
        newTransaction,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error adding asset to portfolio' });
    }
  },
};

export default assetController;
