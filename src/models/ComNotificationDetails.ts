import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityNotificationDetail extends Model {}

CommodityNotificationDetail.init(
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
        notificationToken: {
            type: DataTypes.STRING,
        },
        deviceName: {
            type: DataTypes.STRING,
        },
        deviceId: {
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
