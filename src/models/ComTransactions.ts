import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export class CommodityTransaction extends Model {}

CommodityTransaction.init(
   {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey:true,
                type: DataTypes.INTEGER,
            },
            transferorAccountNumber: {
                type: DataTypes.STRING,
            },
            transfereeAccountNumber: {
                type: DataTypes.STRING,
            },
            amount: {
                type: DataTypes.STRING,
            },
            transactionId: {
                type: DataTypes.STRING,
                unique:true
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

