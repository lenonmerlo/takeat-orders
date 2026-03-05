import { DataTypes, Model } from "sequelize";

export class Input extends Model {}

export function initInput(sequelize) {
  Input.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      stockQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "stock_qty",
      },
      unit: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "un",
      },
    },
    {
      sequelize,
      modelName: "Input",
      tableName: "inputs",
      timestamps: true,
      underscored: true,
    },
  );
  return Input;
}
