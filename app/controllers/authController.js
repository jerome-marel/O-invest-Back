import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authController = {
  register: async (req, res) => {
    const {
      firstName, lastName, email, password, riskProfile,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const newUser = {
        firstName, lastName, email, password, riskProfile,
      };
      const user = await User.create(newUser);

      const token = jwt.sign({ username: user.email }, 'key', { expiresIn: '1h' });
      return res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export default authController;
