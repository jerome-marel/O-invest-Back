import { DataTypes, Model } from 'sequelize';

import sequelize from '../../database.js';

class AssetList extends Model {}

AssetList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'AssetList',
    tableName: 'asset_list',
    createdAt: 'created_at', // evite le camelCase de Sequelize.
    updatedAt: 'updated_at', // idem.
  },
);

export default AssetList;
