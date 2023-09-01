import { DataTypes, Model } from 'sequelize';

import sequelize from '../../database.js';

class Portfolio extends Model {}

Portfolio.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    strategy: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalInvested: {
      type:
      DataTypes.FLOAT(9, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Portfolio',
    tableName: 'portfolio',
  },
);

export default Portfolio;
