import { AppError } from "./AppError.js";

export class InsufficientStockError extends AppError {
  constructor(details = []) {
    super({
      message: "Estoque insuficiente para finalizar o pedido",
      status: 409,
      code: "INSUFFICIENT_STOCK",
      details,
    });
  }
}
