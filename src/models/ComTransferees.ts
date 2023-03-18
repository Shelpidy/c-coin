import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export class CommodityTransferee extends Model {}

CommodityTransferee.init(
{
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey:true,
                type: DataTypes.INTEGER,
            },
            email: {
                type: DataTypes.STRING,
                allowNull:false,
                references:{
                    model:'CommodityUsers',
                    key:"email"
                }
            },
            transfereeEmail: {
                type: DataTypes.STRING,
            },
            trsnafereeName: {
                type: DataTypes.STRING,
            },
            trsnafereeAccountNumber: {
                type: DataTypes.STRING,
            },
            trsnaferorAccountNumber: {
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

