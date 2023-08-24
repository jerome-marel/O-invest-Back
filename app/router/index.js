import express from 'express';
import authController from '../controllers/authController.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
});

// Route pour créer un user
router.post('/register', authController.register);

router.use(errorHandler);

export default router;
