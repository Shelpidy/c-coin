'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
            await queryInterface.createTable('CommodityNotifications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey:true,
                type: Sequelize.INTEGER,
            },
             email: {
                type: Sequelize.STRING,
                allowNull:false,
                references:{
                    model:'CommodityUsers',
                    key:"email"
                }
            },
            title: {
                type: Sequelize.STRING,
            },
            message: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            notificationType:{
                type:Sequelize.STRING
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
         await queryInterface.dropTable('CommodityNotifications');
    },
};
