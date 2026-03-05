import { ValidationError } from "../errors/ValidationError.js";

export function validateCreateInputPayload(body) {
  const errors = [];

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const unit = typeof body?.unit === "string" ? body.unit.trim() : "";
  const stockQty = body?.stockQty ?? body?.stock_qty ?? body?.stock;

  if (!name) errors.push({ field: "name", message: "name é obrigatório" });
  if (!unit) errors.push({ field: "unit", message: "unit não pode ser vazio" });

  const stockNumber = stockQty === undefined ? 0 : Number(stockQty);
  if (!Number.isInteger(stockNumber) || stockNumber < 0) {
    errors.push({
      field: "stockQty",
      message: "stockQty deve ser inteiro >= 0",
    });
  }

  if (errors.length) throw new ValidationError("Payload inválido", errors);

  return { name, unit, stockQty: stockNumber };
}

export function validateUpdateStockPayload(body) {
  const errors = [];

  const hasDelta = Object.prototype.hasOwnProperty.call(body ?? {}, "delta");
  const hasStockQty =
    Object.prototype.hasOwnProperty.call(body ?? {}, "stockQty") ||
    Object.prototype.hasOwnProperty.call(body ?? {}, "stock_qty") ||
    Object.prototype.hasOwnProperty.call(body ?? {}, "stock");

  if (!hasDelta && !hasStockQty) {
    errors.push({ field: "body", message: "informe delta ou stockQty" });
  }
  if (hasDelta && hasStockQty) {
    errors.push({
      field: "body",
      message: "use apenas delta OU stockQty, não ambos",
    });
  }

  let delta = null;
  let stockQty = null;

  if (hasDelta) {
    delta = Number(body.delta);
    if (!Number.isInteger(delta))
      errors.push({ field: "delta", message: "delta deve ser inteiro" });
  }

  if (hasStockQty) {
    const raw = body.stockQty ?? body.stock_qty ?? body.stock;
    stockQty = Number(raw);
    if (!Number.isInteger(stockQty) || stockQty < 0) {
      errors.push({
        field: "stockQty",
        message: "stockQty deve ser inteiro >= 0",
      });
    }
  }

  if (errors.length) throw new ValidationError("Payload inválido", errors);

  return hasDelta ? { mode: "delta", delta } : { mode: "set", stockQty };
}
