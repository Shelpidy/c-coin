"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("CommodityChatRoomMessages", {
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
            text: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            audio: {
                type: Sequelize.STRING,
            },
            video: {
                type: Sequelize.STRING,
            },
            otherFile: {
                type: Sequelize.STRING,
            },
            roomId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "CommodityChatRooms",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            sent: {
                type: Sequelize.BOOLEAN,
            },
            received: {
                type: Sequelize.BOOLEAN,
            },
            pending: {
                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable("CommodityChatRoomMessages");
    },
};
