import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export class CommodityApiToken extends Model {}

CommodityApiToken.init(
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
            apiToken: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            expirationDate:{
                 allowNull: true,
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

