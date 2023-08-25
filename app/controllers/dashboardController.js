import User from '../models/User.js';

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
};

export default dashboardController;
