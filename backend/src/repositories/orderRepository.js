import { Order, OrderItem, Product } from "../models/index.js";

export async function findByClientRequestId(clientRequestId, transaction) {
  return Order.findOne({
    where: { clientRequestId },
    include: [{ model: OrderItem, as: "items" }],
    transaction,
  });
}

export async function createOrder(data, transaction) {
  return Order.create(data, { transaction });
}

export async function createOrderItems(orderId, items, transaction) {
  return OrderItem.bulkCreate(
    items.map((item) => ({
      orderId,
      productId: item.productId,
      qty: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
    { transaction },
  );
}

export async function findAllWithItems() {
  return Order.findAll({
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
}

export async function findAllWithItemsPaginated({ limit, offset }) {
  return Order.findAndCountAll({
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
    limit,
    offset,
    distinct: true,
  });
}

export async function findByIdWithItems(id, transaction) {
  return Order.findByPk(id, {
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price"],
          },
        ],
      },
    ],
    transaction,
  });
}

export async function saveOrder(order, transaction) {
  await order.save({ transaction });
  return order;
}
