import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import '../utils/env.load.js';
import validateEmail from '../utils/emailValidator.js';
import validateName from '../utils/nameValidator.js';

const authController = {
  register: async (req, res) => {
    const secretToken = process.env.TOKEN_SECRET;

    const {
      firstName, lastName, email, password, riskProfile,
    } = req.body;

    if (!email || !password || !firstName || !lastName || !riskProfile) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      return res.status(400).json({ error: 'First name and last name can only be letters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
      const newUser = {
        firstName, lastName, email, password, riskProfile,
      };
      const user = await User.create(newUser);

      const token = jwt.sign({ user: user.email }, secretToken, { expiresIn: '1h' });
      return res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export default authController;
