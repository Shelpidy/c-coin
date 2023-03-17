import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    dialect: 'mysql',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
});
export default sequelize;
