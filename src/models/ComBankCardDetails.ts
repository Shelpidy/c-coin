import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityBankCardDetail extends Model {}

CommodityBankCardDetail.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "email",
            },
        },
        cardNumber: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        cardType: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        cvvCode: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        cashHolderName: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        billingAddress: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        expirationDate: {
            allowNull: false,
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
