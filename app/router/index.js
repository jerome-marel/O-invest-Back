import express from 'express';

import { errorHandler } from '../middlewares/error.middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('BUENOS DIAAAAAAAS CA FONCTIONNNNNNNNNNNE');
});

router.use(errorHandler);

export default router;
