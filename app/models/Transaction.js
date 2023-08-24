import { DataTypes, Model } from 'sequelize';

import sequelize from '../../database.js';

class Transaction extends Model {}

Transaction.init(
  {
    purchaseDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sellDatetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
    },
    totalTransacted: {
      type: DataTypes.DECIMAL(9, 2),
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
    tableName: 'transaction',
  },
);

export default Transaction;
