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

        await queryInterface.createTable("CommodityNotificationDetails", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            profileImage: {
                type: Sequelize.STRING,
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
            notificationToken: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            deviceName: {
                type: Sequelize.STRING,
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

        await queryInterface.dropTable("CommodityNotificationDetails");
    },
};
