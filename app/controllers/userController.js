import Portfolio from '../models/Portfolio.js';
import PortfolioAsset from '../models/PortfolioAsset.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import '../utils/env.load.js';

const userController = {
  getProfile: async (req, res) => {
    const userId = req.user.id;
    try {
      const userInfo = await User.findByPk(userId);

      if (userInfo) {
        return res.status(200).json({
          message: 'User found in database',
          userInfo,
        });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  editProfile: async (req, res) => {
    try {
      const {
        firstName, lastName, email, riskProfile,
      } = req.body;
      const updatedData = {
        firstName, lastName, email, riskProfile,
      };
      const foundUser = await User.findByPk(req.params.id);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found. Please check the provided id.' });
      }
      await foundUser.update(updatedData);
      return res.status(200).json({ message: 'Profile updated successfully', foundUser });
    } catch (err) {
      // console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
    return null;
  },

  deleteProfile: async (req, res) => {
    const userId = req.user.id;

    try {
      const foundUser = await User.findByPk(userId);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found. Please check the provided id.' });
      }

      const portfoliosToDelete = await Portfolio.findAll({
        where: { userId },
      });

      const portfolioIds = portfoliosToDelete.map((portfolio) => portfolio.id);

      const portfolioAssetsToDelete = await PortfolioAsset.findAll({
        where: { portfolioId: portfolioIds },
      });

      const portfolioAssetIds = portfolioAssetsToDelete.map((portfolioAsset) => portfolioAsset.id);

      const transactionsToDelete = Transaction.findAll({
        where: { portfolioAssetId: portfolioAssetIds },
      });

      await Transaction.destroy({
        where: { portfolioAssetId: portfolioAssetIds },
      });

      await PortfolioAsset.destroy({
        where: { portfolioId: portfolioIds },
      });

      await Portfolio.destroy({
        where: { userId },
      });

      await foundUser.destroy();

      return res.status(200).json({
        message: 'Profile deleted, associated portfolios deleted',
        portfolioAssetsToDelete,
        transactionsToDelete,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, could not delete profile. Please try again later' });
    }
  },
};

export default userController;
