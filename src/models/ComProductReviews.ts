import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../database/connection";

class CommodityProductReview extends Model {
    //   public id!: number;
    //   public postId!: number;
    //   public userId!: number;
    //   public createdAt!: Date;
    //   public updatedAt!: Date;
}

CommodityProductReview.init(
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
        tableName: "CommodityProductReviews",
        timestamps: true,
        // underscored: true,
        modelName: "CommodityProductReview",
    }
);

export default CommodityProductReview;
