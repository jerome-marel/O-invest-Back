import Portfolio from '../models/Portfolio.js';

const portfolioController = {
  createPortfolio: async (req, res) => {
    const { name, strategy } = req.body;
    const userId = req.user.id; // permets de passer par le middleware et vérifier le token

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
  getAllPortfolios: async (req, res) => {
    const userId = req.user.id;
    try {
      const allPortfolios = await Portfolio.findAll({
        where: { user_id: userId },
      });
      if (!allPortfolios) {
        res.status(404).json({ error: 'No portfolios for this user' });
      }
      return res.status(201).json({ message: 'Successfully retrieved all portfolios', allPortfolios });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving all portfolios' });
    }
  },
  getOnePortfolio: async (req, res) => {
    const { id } = req.params;
    try {
      const portfolio = await Portfolio.findByPk(id);
      if (!portfolio) {
        return res.status(404).json({ error: 'Invalid portfolio id entered - portfolio does not exist' });
      }
      return res.status(200).json({ message: 'Successfully retrieved portfolio', portfolio });
    } catch (err) {
      return res.status(500).json({ error: 'Error in retrieving portfolio, please try again later' });
    }
  },

};

export default portfolioController;
