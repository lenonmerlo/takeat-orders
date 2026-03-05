import { DataTypes, Model } from "sequelize";

export class ProductInput extends Model {}

export function initProductInput(sequelize) {
  ProductInput.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
      },
      inputId: { type: DataTypes.INTEGER, allowNull: false, field: "input_id" },
      qtyRequired: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "qty_required",
      },
    },
    {
      sequelize,
      modelName: "ProductInput",
      tableName: "product_inputs",
      timestamps: false,
      underscored: true,
      indexes: [{ unique: true, fields: ["product_id", "input_id"] }],
    },
  );

  return ProductInput;
}
