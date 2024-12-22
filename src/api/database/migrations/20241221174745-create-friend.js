'use strict';
const {REQUEST_STATUS} = require("../../utils/texts");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Friends', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      friend_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: REQUEST_STATUS[0]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Friends');
  }
};