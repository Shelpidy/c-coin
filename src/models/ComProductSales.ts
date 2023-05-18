import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

export class CommodityProductSale extends Model {
    //   public id!: number;
    //   public sellerId!: number;
    //   public productId!: number;
    //   public saleType!: string;
    //   public readonly createdAt!: Date;
    //   public updatedAt!: Date;
}

CommodityProductSale.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityProducts",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        saleType: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "CommodityProductSale",
        tableName: "CommodityProductSales",
    }
);
