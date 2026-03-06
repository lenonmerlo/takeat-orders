import * as orderService from "../services/orderService.js";
import { ValidationError } from "../errors/ValidationError.js";
import { validateCreateOrderPayload } from "../validators/orderValidator.js";
import { validateUpdateOrderStatusPayload } from "../validators/orderStatusValidator.js";

function parseOrderId(idParam) {
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("Payload inválido", [
      {
        field: "id",
        message: "id deve ser inteiro > 0",
      },
    ]);
  }

  return id;
}

export async function createOrder(req, res, next) {
  try {
    const idempotencyKey =
      req.get("Idempotency-Key") || req.get("X-Idempotency-Key") || null;
    const payload = validateCreateOrderPayload(req.body, idempotencyKey);

    const result = await orderService.createOrder(payload);

    if (result.reused) {
      return res.status(200).json(result);
    }

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const id = parseOrderId(req.params.id);
    const order = await orderService.getOrderById(id);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const id = parseOrderId(req.params.id);
    const payload = validateUpdateOrderStatusPayload(req.body);
    const order = await orderService.updateOrderStatus(id, payload);
    res.json(order);
  } catch (err) {
    next(err);
  }
}