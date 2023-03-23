import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityUser extends Model {

    getFullname(){
        return this.get('firstName')||"" +" "+ this.get('middleName')||"" +" "+ this.get('lastName')||""
    }
}

CommodityUser.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        profileImage: {
            type: DataTypes.STRING,
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
            unique:true
        },
        dob: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
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
