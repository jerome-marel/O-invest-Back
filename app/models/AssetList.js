import { DataTypes, Model } from 'sequelize';

import sequelize from '../../database.js';

class AssetList extends Model {}

AssetList.init(
  {
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sector: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AssetList',
    tableName: 'asset_list',
  },
);

export default AssetList;
