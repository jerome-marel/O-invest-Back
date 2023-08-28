import Portfolio from '../models/Portfolio.js';

/*
const portfolioController = {

  createPortfolio: async (req, res) => {
    const {
      name,
      strategy,
      userId,
    } = req.body;

    try {
      const newPortfolio = await Portfolio.create({
        name,
        strategy,
        userId,
      });

      return res.status(200).json({ message: 'New portfolio successfully added', newPortfolio });
    } catch (err) {
    //   console.error('Error creating portfolio:', err);
      res.status(500).json({ error: 'Error creating new portfolio' });
    } return null;
  },
  */

// cette method ne fonctionne pas encore car le token n'est pas stocké côté front

const portfolioController = {
  createPortfolio: async (req, res) => {
    const { name, strategy } = req.body;
    const { userId } = req.userId; // permets de passer par le middleware et vérifier le token

    try {
      const newPortfolio = await Portfolio.create({
        name,
        strategy,
        userId,
      });

      return res.status(200).json({ message: 'New portfolio successfully added', newPortfolio });
    } catch (err) {
      return res.status(500).json({ error: 'Error creating new portfolio' });
    }
  },

};

export default portfolioController;
