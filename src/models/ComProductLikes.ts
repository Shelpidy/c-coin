import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../database/connection";

class CommodityProductLike extends Model {
//   public id!: number;
//   public postId!: number;
//   public userId!: number;
//   public createdAt!: Date;
//   public updatedAt!: Date;
}

CommodityProductLike.init(
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
    tableName: "CommodityProductLikes",
    timestamps: true,
    underscored: true,
    modelName: "CommodityProductLike",
  }
);

export default CommodityProductLike;
