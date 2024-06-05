'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      pin: {
        type: Sequelize.STRING(6),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      phoneNumber: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      isPremium: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('Users');
  }
};