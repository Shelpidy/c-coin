import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityTransferee extends Model {}

CommodityTransferee.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        transferorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
        },
        transfereeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
        },
        transfereeName: {
            type: DataTypes.STRING,
        },
        transfereeAccountNumber: {
            type: DataTypes.STRING,
        },
        transferorAccountNumber: {
            type: DataTypes.STRING,
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
