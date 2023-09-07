import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database.js';

class PortfolioAsset extends Model {}

PortfolioAsset.init(
  {
    portfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    remainingQuantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    historicPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PortfolioAsset',
    tableName: 'portfolio_asset',
  },
);

export default PortfolioAsset;
