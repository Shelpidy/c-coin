const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
    },
    production: {
        username: process.env.PG_DB_USERNAME,
        password: process.env.PG_DB_PASSWORD,
        database: process.env.PG_DB_NAME,
        host: process.env.PG_DB_HOST,
        dialect: "postgres",
    },
};
