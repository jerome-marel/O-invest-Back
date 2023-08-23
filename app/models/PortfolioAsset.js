import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database.js';

class PortfolioAsset extends Model {}

PortfolioAsset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AssetList', //  reference a AssetList model
        key: 'id',
      },
    },
    portfolio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Portfolio', //  reference à Portfolio model
        key: 'id',
      },
    },
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
    createdAt: 'created_at', // evite le camelCase de Sequelize.
    updatedAt: 'updated_at', // idem.
  },
);

export default PortfolioAsset;
