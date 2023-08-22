import { createServer } from 'http';
import app from './app/app.js';

const PORT = process.env.PORT ?? 3000;

const server = createServer(app);

// eslint-disable-next-line no-console
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${PORT}`);// utiliser eventuellement un logger Winston?
});
