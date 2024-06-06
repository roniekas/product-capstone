'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Activities', {
      activityId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      activityType: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      notes: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      walletId: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      iconId: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      billId: {
        type: Sequelize.STRING(255),
        allowNull: false
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
    await queryInterface.dropTable('Activities');
  }
};