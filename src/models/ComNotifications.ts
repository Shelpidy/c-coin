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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
        },
        title: {
            type: DataTypes.STRING,
        },
        message: {
            type: DataTypes.STRING,
        },
        readStatus: {
            type: DataTypes.BOOLEAN,
        },
        notificationFrom: {
            type: DataTypes.INTEGER,
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
