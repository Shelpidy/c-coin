import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class CommodityReplyLike extends Model {}

CommodityReplyLike.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        replyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "CommodityCommentReplies",
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
        tableName: "CommodityReplyLikes",
        timestamps: true,
    }
);

export default CommodityReplyLike;
