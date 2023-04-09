import sequelize from "../database/connection";
import { Model, DataTypes } from "sequelize";

class CommodityFollower extends Model {
    static associate(models: any) {
        this.belongsTo(models.CommodityPost, { foreignKey: "postId" });
        this.belongsTo(models.CommodityUser, { foreignKey: "userId" });
    }
}

CommodityFollower.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        followerId: {
            type: DataTypes.INTEGER,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
            allowNull: false,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        followingId: {
            type: DataTypes.INTEGER,
            references: {
                model: "CommodityUsers",
                key: "id",
            },
            allowNull: false,
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
        modelName: "CommodityFollower",
        tableName: "CommodityFollowers",
        timestamps: true,
    }
);

export default CommodityFollower;
