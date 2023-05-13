"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("CommodityUserStatus", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            typing: {
                type:Sequelize.BOOLEAN
            },
            online: {
                type:Sequelize.BOOLEAN,
            },
            onChatScreen: {
                type:Sequelize.BOOLEAN,
            },
            reading: {
                type:Sequelize.BOOLEAN,
            },
            posting: {
                type:Sequelize.BOOLEAN,
            },
            lastSeen: {
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("CommodityUserStatus");
    },
};
