import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../database/connection";

class CommodityProductRequest extends Model {
    //   public id!: number;
    //   public postId!: number;
    //   public userId!: number;
    //   public createdAt!: Date;
    //   public updatedAt!: Date;
}

CommodityProductRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
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
        tableName: "CommodityProductRequests",
        timestamps: true,
        // underscored: true,
        modelName: "CommodityProductRequest",
    }
);

export default CommodityProductRequest;
