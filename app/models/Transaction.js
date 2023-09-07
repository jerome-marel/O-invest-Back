import { DataTypes, Model } from 'sequelize';

import sequelize from '../../database.js';

class Transaction extends Model {}

Transaction.init(
  {
    portfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    portfolioAssetId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    purchaseDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sellDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    assetPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalTransacted: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    note: {
      type:
        DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transaction',
  },
);

export default Transaction;
