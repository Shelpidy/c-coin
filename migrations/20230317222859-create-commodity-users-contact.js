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
        await queryInterface.createTable("CommodityUserContacts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            country: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            permanentAddress: {
                type: Sequelize.STRING,
            },
            currentAddress: {
                type: Sequelize.STRING,
            },
            phoneNumbers: {
                type: Sequelize.JSON,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
                references: {
                    model: "CommodityUsers",
                    key: "email",
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
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("CommodityUserContacts");
    },
};
