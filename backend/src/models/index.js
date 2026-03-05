import { initInput, Input } from "./Input.js";
import { initOrder, Order } from "./Order.js";
import { initOrderItem, OrderItem } from "./OrderItem.js";
import { initProduct, Product } from "./Product.js";
import { initProductInput, ProductInput } from "./ProductInput.js";

export function initModels(sequelize) {
  initProduct(sequelize);
  initInput(sequelize);
  initProductInput(sequelize);
  initOrder(sequelize);
  initOrderItem(sequelize);

  Product.belongsToMany(Input, {
    through: ProductInput,
    foreignKey: "product_id",
    otherKey: "input_id",
    as: "inputs",
  });

  Input.belongsToMany(Product, {
    through: ProductInput,
    foreignKey: "input_id",
    otherKey: "product_id",
    as: "products",
  });

  Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

  Product.hasMany(OrderItem, { foreignKey: "product_id", as: "orderItems" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

  return { Product, Input, ProductInput, Order, OrderItem };
}

export { Input, Order, OrderItem, Product, ProductInput };
