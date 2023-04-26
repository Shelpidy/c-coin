"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable("CommodityProductAffiliates", {
            id: {
                allowNull: false,
                autoIncrement: true,
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            affiliateId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            productId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "CommodityProducts",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
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

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users')
         */
        await queryInterface.dropTable("CommodityProductAffiliates");
    },
};
