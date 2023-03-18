import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export class CommodityUserContact extends Model {
    
}

CommodityUserContact.init(
  {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey:true,
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
            email: {
                type: DataTypes.STRING,
                unique:true,
                allowNull:false,
                references:{
                    model:'CommodityUsers',
                    key:"email"
                }
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

