import { Model, DataTypes } from 'sequelize';
import sequelize from "../database/connection";

export class CommodityProductAffiliate extends Model {
//   public id!: number;
//   public affiliateId!: number;
//   public productId!: number;
//   public readonly createdAt!: Date;
//   public updatedAt!: Date;
}

CommodityProductAffiliate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    affiliateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CommodityUsers',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CommodityProducts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    modelName: 'CommodityProductAffiliate',
    tableName: 'CommodityProductAffiliates',
  }
);
