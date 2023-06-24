import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/connection";

class CommodityPostTag extends Model {
    static associate(models: any) {
        this.belongsTo(models.CommodityPost, { foreignKey: "postId" });
        this.belongsTo(models.CommodityUser, { foreignKey: "userId" });
    }
}

CommodityPostTag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        modelName: "CommodityPostComment",
        tableName: "CommodityPostTags",
        timestamps: true,
    }
);

export default CommodityPostTag;
