import express from 'express';
import authController from '../controllers/authController.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
});

// Route pour créer un user
router.post('/register', authController.register);

// Route pour login
router.post('/login', authController.login);

router.use(errorHandler);

export default router;
