"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("CommodityUsers", {
            id: {
                allowNull: false,
                autoIncrement: true,
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.STRING,
            },
            middleName: {
                type: Sequelize.STRING,
            },
            lastName: {
                type: Sequelize.STRING,
            },
            profileImage: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            pinCode: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.STRING,
            },
            accountNumber: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            dob: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
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
        await queryInterface.dropTable("CommodityUsers");
    },
};
