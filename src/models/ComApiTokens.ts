import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityApiToken extends Model {}

CommodityApiToken.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
        },
        apiToken: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        expirationDate: {
            allowNull: true,
            type: DataTypes.DATE,
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
