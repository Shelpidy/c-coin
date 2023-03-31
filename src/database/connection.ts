import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
    host:process.env.ENV == "development"?process.env.DB_HOST:process.env.PG_DB_HOST,
    dialect:process.env.ENV == "development"?"mysql":"postgres",
    database:process.env.ENV == "development"?process.env.DB_NAME:process.env.PG_DB_NAME,
    password:process.env.ENV == "development"?process.env.DB_PASSWORD:process.env.PG_DB_PASSWORD,
    username:process.env.ENV == "development"?process.env.DB_USERNAME:process.env.PG_DB_USERNAME,
});
export default sequelize;
