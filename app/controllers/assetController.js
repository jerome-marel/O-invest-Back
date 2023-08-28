import AssetList from '../models/AssetList.js';

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

      return res.status(200).json({ message: 'All assets successfully retrieved', allAssets });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving all assets' });
    }
  },
};

export default assetController;
