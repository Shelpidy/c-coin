"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("CommodityConversations", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            senderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            receipientId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            lastText: {
                type: Sequelize.STRING,
            },
            receipientReadStatus: {
                type: Sequelize.BOOLEAN,
            },
            roomId: {
                type: Sequelize.INTEGER,
                unique: true,
            },
            numberOfUnReadText: {
                type: Sequelize.INTEGER,
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("CommodityConversations");
    },
};
