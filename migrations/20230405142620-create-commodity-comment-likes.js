"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("CommodityPostCommentLikes", {
            id: {
                allowNull: false,
                autoIncrement: true,
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            commentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "CommodityPostComments",
                    key: "id",
                },
                allowNull: false,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                allowNull: false,
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
        await queryInterface.dropTable("CommodityPostCommentLikes");
    },
};
