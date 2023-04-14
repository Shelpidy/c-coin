import { Sequelize, Model, DataTypes } from 'sequelize';
import sequelize from "../database/connection";

class CommodityProduct extends Model {
//   public id!: number;
//   public productName!: string;
//   public category!: string;
//   public description!: string;
//   public images!: Record<string, any>[];
//   public price!: string;
//   public initialPrice!: string;
//   public affiliatePrice!: string;
//   public sizes!: Record<string, any>[];
//   public numberAvailable!: string;
//   public rating!: number;
//   public availability!: string;
//   public userId!: number;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
}

CommodityProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    images: {
      type: DataTypes.JSON,
    },
    price: {
      type: DataTypes.STRING,
    },
    initialPrice: {
      type: DataTypes.STRING,
    },
    affiliatePrice: {
      type: DataTypes.STRING,
    },
    sizes: {
      type: DataTypes.JSON,
    },
    numberAvailable: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    availability: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CommodityUsers',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    modelName: 'CommodityProduct',
    tableName: 'CommodityProducts',
    timestamps: true,
    underscored: false,
  }
);

export default CommodityProduct;
