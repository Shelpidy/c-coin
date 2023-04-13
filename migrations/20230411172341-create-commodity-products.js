'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("CommodityProducts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                type: Sequelize.INTEGER,
                primaryKey: true,
            },

            productName: {
                type: Sequelize.STRING,
            },

            category: {
                type: Sequelize.STRING,
            },

            description: {
                type: Sequelize.STRING,
            },

            images: {
                type: Sequelize.JSON,
            },

            price: {
                type: Sequelize.STRING,
            },
            initialPrice: {
                type: Sequelize.STRING,
            },

            sizes: {
                type: Sequelize.JSON,
            },
            numberAvailable: {
                type: Sequelize.STRING,
            },

            rating: {
                type: Sequelize.INTEGER,
            },

            availability:{
              type:Sequelize.STRING
            },

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references:{
                  model:'CommodityUsers',
                  key:'id'
                },
                onDelete:"CASCADE",
                onUpdate:"CASCADE"
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },

            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users')
     */
      await queryInterface.dropTable("CommodityProducts");
  }
};
