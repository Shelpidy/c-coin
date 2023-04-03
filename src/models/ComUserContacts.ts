import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityUserContact extends Model {}

CommodityUserContact.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        country: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        permanentAddress: {
            type: DataTypes.STRING,
        },
        currentAddress: {
            type: DataTypes.STRING,
        },
        phoneNumbers: {
            type: DataTypes.JSON,
        },
        userId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "id",
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
