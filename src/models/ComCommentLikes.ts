import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class CommodityCommentLike extends Model {}

CommodityCommentLike.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityPosts",
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
        tableName: "CommodityCommentLikes",
        timestamps: true,
    }
);

export default CommodityCommentLike;
