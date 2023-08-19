import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityTransaction extends Model {}

CommodityTransaction.init(
    {
        transactionId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4
        },
        senderAddress: {
            type: DataTypes.STRING,
        },
        recipientAddress: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.STRING,
        },
        hash: {
            type: DataTypes.STRING,
        },
        previousTransactionHash:{
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
