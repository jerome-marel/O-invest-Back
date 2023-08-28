import axios from 'axios';
import AssetList from '../models/AssetList.js';
// import User from '../models/User.js';
// import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';

const assetController = {
  getAllAssets: async (req, res) => {
    try {
      const allAssets = await AssetList.findAll();

      const cleanedAssets = allAssets.map((asset) => ({
        id: asset.dataValues.id,
        symbol: asset.dataValues.symbol,
        name: asset.dataValues.name,
      }));

      console.log(cleanedAssets);

      return res.status(200).json({ message: 'All assets successfully retrieved', cleanedAssets });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving all assets' });
    }
  },

  addAssetToPortfolio: async (req, res) => {
    const {
      assetId, purchaseDatetime, quantity, portfolioId,
    } = req.body;

    try {
      // Retrieve the asset information based on the provided assetId
      const asset = await AssetList.findByPk(assetId);

      if (!asset) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      // Assuming you have a logged-in user and can get the user's ID
      const userId = req.user.id; // Replace with how you retrieve user ID
      const portfolioId = req.params.id;

      const apiKey = process.env.TWELVEDATA_API_KEY;
      const realTimeURL = `https://api.twelvedata.com/price?symbol=${asset.symbol}&apikey=${apiKey}`;
      const resCurrentPrice = await axios.get(realTimeURL);
      const currentPriceData = parseFloat(resCurrentPrice.data.price);

      // Create a new portfolio asset entry
      const newPortfolioAsset = await PortfolioAsset.create({
        userId,
        assetId,
        purchaseDatetime,
        remainingQuantity: quantity,
        name: asset.name,
        symbol: asset.symbol,
        portfolioId,
        historicPrice: currentPriceData,
      });

      // Format purchaseDatetime to match API format
      const apiFormattedDate = purchaseDatetime.replace(' ', '%20').replace(':', '%3A');

      // Construct the API request URL
      const apiUrl = `https://api.twelvedata.com/time_series?apikey=${apiKey}&interval=1min&symbol=${asset.symbol}&start_date=${apiFormattedDate}&end_date=${apiFormattedDate}&format=JSON`;
      console.log(apiUrl);
      // Make the API request to Twelve Data
      const response = await axios.get(apiUrl);
      const priceData = response.data.values[0].open;
      console.log(priceData);

      // Calculate the total value of the purchase
      const purchaseValue = priceData * quantity;

      return res.status(201).json({
        message: 'Asset added to portfolio successfully',
        portfolioAsset: {
          id: newPortfolioAsset.id,
          asset: {
            id: asset.id,
            symbol: asset.symbol,
            name: asset.name,
          },
          purchaseDatetime,
          quantity,
          purchaseValue,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error adding asset to portfolio' });
    }
  },
};

export default assetController;
