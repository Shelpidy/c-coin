'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        queryInterface.bulkInsert('Users', [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'example@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                firstName: 'Mohamed',
                lastName: 'Kamara',
                email: 'ingshelpidy@gmail.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                firstName: 'Mariama',
                lastName: 'Bah',
                email: 'maraima@gmail.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        queryInterface.bulkDelete('Users', null, {});
    },
};
