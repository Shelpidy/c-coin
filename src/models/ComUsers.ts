import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export class CommodityUser extends Model {}

CommodityUser.init(
     {
            id: {
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                primaryKey:true
            },
            firstName: {
                type: DataTypes.STRING,
            },
            middleName: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
            },
            pinCode: {
                type: DataTypes.STRING,
            },
            gender: {
                type: DataTypes.STRING,
            },
            accountNumber: {
                type: DataTypes.STRING,
            },
            dob: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
                unique:true,
                allowNull:false
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

