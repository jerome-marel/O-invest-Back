import { Sequelize } from 'sequelize';
import './app/utils/env.load.js';
import logger from './app/utils/logger.js';

const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true,
  },
  dialect: process.env.DIALECT,
  dialectOptions: { decimalNumbers: true },
});

// Test DB connection
sequelize.authenticate()
  .then(() => {
    logger.info('Database connected successfully.');
  })
  .catch((err) => {
    logger.info('Unable to connect to the database:', err);
  });

export default sequelize;
