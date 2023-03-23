import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class Commodity extends Model {}

Commodity.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        balance: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            references: {
                model: "CommodityUsers",
                key: "email",
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    { sequelize }
);
