import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database.js';

class PortfolioAsset extends Model {}

PortfolioAsset.init(
  {
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    remaining_quantity: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false,
    },
    historic_price: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PortfolioAsset',
    tableName: 'portfolio_asset',
  },
);

export default PortfolioAsset;
