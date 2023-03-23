import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityNotification extends Model {}

CommodityNotification.init(
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
        title: {
            type: DataTypes.STRING,
        },
        message: {
            type: DataTypes.STRING,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        notificationType: {
            type: DataTypes.STRING,
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    { sequelize }
);
