import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection";

class CommodityPost extends Model {}

CommodityPost.init(
    {
        title: DataTypes.TEXT,
        text: DataTypes.TEXT,
        images: DataTypes.JSON,
        video: DataTypes.STRING,
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
