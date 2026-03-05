import { DataTypes, Model } from "sequelize";

export class OrderItem extends Model {}

export function initOrderItem(sequelize) {
  OrderItem.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      orderId: { type: DataTypes.INTEGER, allowNull: false, field: "order_id" },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
      },
      qty: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "unit_price",
      },
      lineTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "line_total",
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
      timestamps: false,
      underscored: true,
    },
  );

  return OrderItem;
}
