import { DataTypes, Model } from "sequelize";

export class Order extends Model {}

export function initOrder(sequelize) {
  Order.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      clientRequestId: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
        field: "client_request_id",
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "CREATED",
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
      underscored: true,
    },
  );

  return Order;
}
