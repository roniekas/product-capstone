'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Wallet, {
        foreignKey: 'userId',
        as: 'wallets'
      });

      User.hasMany(models.Activity, {
        foreignKey: 'userId',
        as: 'activities'
      });

      User.hasMany(models.Bill, {
        foreignKey: 'userId',
        as: 'bills'
      });

      User.hasMany(models.Budget, {
        foreignKey: 'userId',
        as: 'budgets'
      });
    }
  }
  User.init({
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pin: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isPremium: {
      type: DataTypes.BOOL,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });
  return User;
};