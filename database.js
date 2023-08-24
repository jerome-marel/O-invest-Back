import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    underscored: true,
  },
  dialect: process.env.DIALECT,
});

export default sequelize;
