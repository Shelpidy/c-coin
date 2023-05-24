import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class CommodityPost extends Model {}

CommodityPost.init(
    {
        title: DataTypes.TEXT,
        text: DataTypes.TEXT,
        images: DataTypes.JSON,
        video: DataTypes.STRING,
        shared: DataTypes.BOOLEAN,
        fromId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "CommodityUsers",
                    key: "id",
                },
                allowNull: false,
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
    },
    {
        sequelize,
    }
);

export default CommodityPost;
