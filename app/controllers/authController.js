// import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import '../utils/env.load.js';
import validateEmail from '../utils/authValidation/emailValidator.js';
import validateName from '../utils/authValidation/nameValidator.js';
import validatePassword from '../utils/authValidation/passwordValidator.js';
import encrpyt from '../utils/authValidation/encrypt.js';

const authController = {

  register: async (req, res) => {
    // const secretToken = process.env.TOKEN_SECRET;

    const {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      riskProfile,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !passwordConfirm || !riskProfile) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateName(firstName) || !validateName(lastName)) {
      return res.status(400).json({ error: 'First name and last name can only be letters' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password does not respect minimum criteria' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
      const existsUser = await User.findOne({ where: { email } });
      if (existsUser) {
        return res.status(400).json({ error: 'EMAIL or password incorrect' });
      }
      const hashedPwd = await encrpyt(password);
      const newUser = {
        firstName, lastName, email, password: hashedPwd, riskProfile,
      };
      await User.create(newUser);
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // login: async (req, res) => {

  // const token = jwt.sign({ user: user.email }, secretToken, { expiresIn: '1h' });
  // return res.status(201).json({ message: 'User registered successfully', token });

  // },
};

export default authController;
