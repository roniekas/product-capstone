'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bill.init({
    billId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    billName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    serviceTax: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    others: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    grandTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    modelName: 'Bill',
    tableName: 'Bills',
    timestamps: true
  });
  return Bill;
};