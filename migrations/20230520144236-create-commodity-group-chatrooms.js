"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("CommodityGroupChatRooms", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            adminId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            otherAdminIds:{
                type:Sequelize.JSON
            },
            groupName:{
                type:Sequelize.STRING
            },
            lastSenderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            memberIds: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            lastText: {
                type: Sequelize.STRING,
            },
            recipientReadIds: {
                type: Sequelize.JSON
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
        await queryInterface.dropTable("CommodityGroupChatRooms");
    },
};
