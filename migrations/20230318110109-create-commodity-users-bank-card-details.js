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
        await queryInterface.createTable("CommodityBankCardDetails", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "CommodityUsers",
                    key: "email",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            cardNumber: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            cardType: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            cvvCode: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            cashHolderName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            billingAddress: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            expirationDate: {
                allowNull: false,
                type: Sequelize.DATE,
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
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("CommodityBankCardDetails");
    },
};
