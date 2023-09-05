import { createServer } from 'http';
import './app/utils/env.load.js';
import app from './app/app.js';
import logger from './app/utils/logger.js';

const PORT = process.env.PORT ?? 3000;

const server = createServer(app);

// eslint-disable-next-line no-console
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  logger.info(`Listening on http://localhost:${PORT}`);// utiliser eventuellement un logger Winston?
});
