import axios from 'axios';
import AssetList from '../models/AssetList.js';
// import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';

const newAssetController = {
  getAllAssets: async (req, res) => {
    try {
      const allAssets = await AssetList.findAll();
      const cleanedAssets = allAssets.map((asset) => ({
        id: asset.dataValues.id,
        symbol: asset.dataValues.symbol,
        name: asset.dataValues.name,
        sector: asset.dataValues.sector,
      }));
      return res.status(200).json({ message: 'All assets successfully retrieved', cleanedAssets });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving all assets' });
    }
  },

  // ADD ASSET TO PORTFOLIO - UPDATES TRANSACTION AND PORTFOLIO_ASSET

  addAssetToPortfolio: async (req, res) => {
    const userId = req.user.id;
    const portfolioId = req.params.id;
    const {
      symbol, purchaseDatetime, quantity, note,
    } = req.body;

    try {
      const apiKey = process.env.TWELVEDATA_API_KEY;

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

      const apiFormattedDate = purchaseDatetime.replace(' ', '%20').replace(':', '%3A');
      const apiUrl = `https://api.twelvedata.com/time_series?apikey=${apiKey}&interval=1min&symbol=${asset.symbol}&start_date=${apiFormattedDate}&end_date=${apiFormattedDate}&format=JSON`;
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.values || response.data.values.length === 0) {
        return res.status(500).json({
          error: 'No data available at the selected date/time. Please select a different date/time.',
        });
      }

      const priceData = parseFloat(response.data.values[0].open);
      const purchaseValue = priceData * parseFloat(quantity);

      let newTransaction;
      let newPortfolioAsset;

      try {
        const updateUserPortfolio = await Portfolio.findOne({
          where: { id: portfolioId, user_id: userId },
        });

        if (!updateUserPortfolio) {
          return res.status(404).json({ error: 'Unauthorized action - portfolio not found or does not belong to the user' });
        }

        // eslint-disable-next-line max-len
        const updatedTotalInvested = parseFloat(updateUserPortfolio.totalInvested) + parseFloat(purchaseValue);

        await Portfolio.update(
          { totalInvested: updatedTotalInvested },
          { where: { id: portfolioId } },
        );

        newTransaction = await Transaction.create({
          assetId: asset.id,
          portfolioId,
          symbol,
          purchaseDatetime,
          assetPrice: priceData,
          quantity,
          totalTransacted: purchaseValue,
          note,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Could not add Transaction to history - please try again later' });
      }

      try {
        newPortfolioAsset = await PortfolioAsset.findOne({
          where: { portfolioId, symbol: asset.symbol },
        });

        if (newPortfolioAsset) {
          // eslint-disable-next-line max-len
          const updateRemainingQuantity = parseFloat(newPortfolioAsset.remainingQuantity) + parseFloat(quantity);
          await newPortfolioAsset.update(
            { remainingQuantity: updateRemainingQuantity },
            { where: { portfolioId } },
          );
        } else {
          const realTimeURL = `https://api.twelvedata.com/price?symbol=${asset.symbol}&apikey=${apiKey}`;
          const resCurrentPrice = await axios.get(realTimeURL);
          const currentPriceData = parseFloat(resCurrentPrice.data.price);

          newPortfolioAsset = await PortfolioAsset.create({
            portfolioId,
            symbol: asset.symbol,
            name: asset.name,
            remainingQuantity: quantity, // Set the initial remaining quantity to the new quantity
            historicPrice: currentPriceData,
          });
        }
      } catch (err) {
        return res.status(500).json({ error: 'Error adding asset to portfolio' });
      }

      const portfolioAssetId = newPortfolioAsset.id;
      await newTransaction.update({ portfolioAssetId });

      return res.status(201).json({
        message: 'Transaction successful - updated in Portfolio and Transaction History',
        newTransaction,
        newPortfolioAsset,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving portfolio' });
    }
  },

};

export default newAssetController;
