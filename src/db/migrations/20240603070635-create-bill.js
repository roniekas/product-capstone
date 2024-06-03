'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bills', {
      billId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      billName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      tax: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      serviceTax: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      others: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grandTotal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bills');
  }
};