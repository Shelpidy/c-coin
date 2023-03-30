import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
    host: process.env.PG_DB_HOST,
    dialect: "postgres",
    database: process.env.PG_DB_NAME,
    password: process.env.PG_DB_PASSWORD,
    username: process.env.PG_DB_USERNAME,
});
export default sequelize;
