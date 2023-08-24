import User from '../models/User.js';

const userController = {
  getProfile: async (req, res) => {
    try {
      const foundUser = await User.findByPk(req.params.id, {
        include: 'userPortfolios',

        order: [
          ['total_invested', 'DESC'],
          ['name', 'ASC'],
        ],
      });
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found. Please check the provided id.' });
      }
      res.json(foundUser);
    } catch (err) {
      console.error('Error getting user', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return null;
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
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
    return null;
  },

  deleteProfile: async (req, res) => {
    try {
      const foundUser = await User.findByPk(req.params.id);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found. Please check the provided id.' });
      }
      await foundUser.destroy();
      res.status(200).json({ message: 'Profile deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
    return null;
  },
};

export default userController;
