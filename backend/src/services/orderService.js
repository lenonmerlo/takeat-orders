import { sequelize } from "../config/database.js";
import * as productRepo from "../repositories/productRepository.js";
import * as inputRepo from "../repositories/inputRepository.js";
import * as orderRepo from "../repositories/orderRepository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { InsufficientStockError } from "../errors/InsufficientStockError.js";
import {
  buildPaginatedResponse,
  parsePagination,
} from "../utils/pagination.js";

function buildInputConsumptionMap(products, orderItems) {
  const consumptionMap = new Map();

  for (const orderItem of orderItems) {
    const product = products.find((p) => p.id === orderItem.productId);

    if (!product) continue;

    for (const input of product.inputs) {
      const qtyRequired = Number(input.ProductInput?.qtyRequired ?? 0);
      const totalRequired = qtyRequired * orderItem.quantity;

      const current = consumptionMap.get(input.id) || {
        inputId: input.id,
        name: input.name,
        unit: input.unit,
        required: 0,
      };

      current.required += totalRequired;
      consumptionMap.set(input.id, current);
    }
  }

  return consumptionMap;
}

function buildOrderItemsWithPricing(products, items) {
  return items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const unitPrice = Number(product.price);
    const lineTotal = unitPrice * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    };
  });
}

function calculateOrderTotal(items) {
  return items.reduce((acc, item) => acc + item.lineTotal, 0);
}

export async function createOrder(payload) {
  return sequelize.transaction(async (transaction) => {
    const existingOrder = await orderRepo.findByClientRequestId(
      payload.clientRequestId,
      transaction,
    );

    if (existingOrder) {
      const hydrated = await orderRepo.findByIdWithItems(
        existingOrder.id,
        transaction,
      );
      return { ...hydrated.toJSON(), reused: true };
    }

    const productIds = [...new Set(payload.items.map((item) => item.productId))];
    const products = await productRepo.findByIdsWithRecipe(productIds, transaction);

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));

      throw new NotFoundError("Um ou mais produtos não existem", {
        missingProductIds: missingIds,
      });
    }

    const consumptionMap = buildInputConsumptionMap(products, payload.items);
    const inputIds = [...consumptionMap.keys()];
    const lockedInputs = await inputRepo.findByIdsForUpdate(inputIds, transaction);

    const stockMap = new Map(
      lockedInputs.map((input) => [
        input.id,
        {
          model: input,
          available: input.stockQty,
        },
      ]),
    );

    const insufficient = [];

    for (const consumption of consumptionMap.values()) {
      const stockEntry = stockMap.get(consumption.inputId);

      if (!stockEntry || stockEntry.available < consumption.required) {
        insufficient.push({
          inputId: consumption.inputId,
          name: consumption.name,
          unit: consumption.unit,
          required: consumption.required,
          available: stockEntry?.available ?? 0,
        });
      }
    }

    if (insufficient.length) {
      throw new InsufficientStockError(insufficient);
    }

    for (const consumption of consumptionMap.values()) {
      const stockEntry = stockMap.get(consumption.inputId);
      stockEntry.model.stockQty = stockEntry.model.stockQty - consumption.required;
      await stockEntry.model.save({ transaction });
    }

    const pricedItems = buildOrderItemsWithPricing(products, payload.items);
    const total = calculateOrderTotal(pricedItems);

    let order;

    try {
      order = await orderRepo.createOrder(
        {
          clientRequestId: payload.clientRequestId,
          status: "CREATED",
          total,
        },
        transaction,
      );
    } catch (error) {
      if (error?.name === "SequelizeUniqueConstraintError") {
        const existing = await orderRepo.findByClientRequestId(
          payload.clientRequestId,
          transaction,
        );

        if (existing) {
          const hydrated = await orderRepo.findByIdWithItems(
            existing.id,
            transaction,
          );
          return { ...hydrated.toJSON(), reused: true };
        }
      }

      throw error;
    }

    await orderRepo.createOrderItems(order.id, pricedItems, transaction);

    const hydrated = await orderRepo.findByIdWithItems(order.id, transaction);
    return { ...hydrated.toJSON(), reused: false };
  });
}

export async function listOrders(query) {
  const pagination = parsePagination(query);
  const result = await orderRepo.findAllWithItemsPaginated(pagination);
  return buildPaginatedResponse({
    rows: result.rows,
    count: result.count,
    page: pagination.page,
    limit: pagination.limit,
  });
}

export async function getOrderById(id) {
  const order = await orderRepo.findByIdWithItems(id);

  if (!order) {
    throw new NotFoundError("Pedido não encontrado");
  }

  return order;
}

export async function updateOrderStatus(id, payload) {
  const order = await orderRepo.findByIdWithItems(id);

  if (!order) {
    throw new NotFoundError("Pedido não encontrado");
  }

  if (order.status === payload.status) {
    return order;
  }

  order.status = payload.status;

  await orderRepo.saveOrder(order);

  return orderRepo.findByIdWithItems(id);
}
