import { createServer } from 'http';
import './app/utils/env.load.js';
import app from './app/app.js';
import logger from './app/utils/logger.js';

const PORT = process.env.PORT ?? 3000;

const server = createServer(app);

server.listen(PORT, () => {
  logger.info(`Listening on http://localhost:${PORT}`);
});
