import { DataTypes, Model } from 'sequelize';

import sequelize from '../../database.js';

class User extends Model {}

User.init(
  {
    first_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    risk_profile: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'user',
  },
);

export default User;
