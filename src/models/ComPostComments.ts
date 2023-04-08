import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/connection";


class CommodityPostComment extends Model {
  static associate(models: any) {
    this.belongsTo(models.CommodityPost, { foreignKey: "postId" });
    this.belongsTo(models.CommodityUser, { foreignKey: "userId" });
  }
}

CommodityPostComment.init(
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
    text: {
      type: DataTypes.TEXT,
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
    tableName: "CommodityPostComments",
    timestamps: true,

  }
);

export default CommodityPostComment;
