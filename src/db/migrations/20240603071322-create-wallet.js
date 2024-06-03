'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wallets', {
      walletId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      walletName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      note: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      iconId: {
        type: Sequelize.STRING(50),
        allowNull: true
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
    await queryInterface.dropTable('Wallets');
  }
};