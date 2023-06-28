'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CommodityPostStatus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CommodityUsers',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      images: {
        type: Sequelize.JSON
      },
      video: {
        type: Sequelize.STRING
      },
      audio: {
        type: Sequelize.STRING
      },
      otherFile: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.STRING
      },
      statusType: {
        type: Sequelize.ENUM('text', 'image', 'video', 'otherFile'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CommodityPostStatus');
  }
};
