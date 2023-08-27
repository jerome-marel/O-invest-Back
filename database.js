import { Sequelize } from 'sequelize';
import './app/utils/env.load.js';

const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true,
  },
  dialect: process.env.DIALECT,
});

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
