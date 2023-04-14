import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/connection';

class CommodityProductComment extends Model {
    // public id!: number;
    // public postId!: number;
    // public userId!: number;
    // public text!: string;
    // public createdAt!: Date;
    // public updatedAt!: Date;

    // static associate(models: any) {
    //     this.belongsTo(models.CommodityProduct, { foreignKey: 'postId', as: 'product' });
    //     this.belongsTo(models.CommodityUser, { foreignKey: 'userId', as: 'user' });
    // }
}

CommodityProductComment.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
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
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: 'CommodityProductComment',
        tableName: 'CommodityProductComments',
    }
);

export default CommodityProductComment;
