import { ValidationError } from "../errors/ValidationError.js";

export function validateCreateOrderPayload(body, idempotencyKey = null) {
  const errors = [];
  const items = Array.isArray(body?.items) ? body.items : [];
  const bodyClientRequestId =
    typeof body?.clientRequestId === "string" ? body.clientRequestId.trim() : null;
  const headerClientRequestId =
    typeof idempotencyKey === "string" ? idempotencyKey.trim() : null;
  const clientRequestId = bodyClientRequestId || headerClientRequestId || null;

  if (!items.length) {
    errors.push({
      field: "items",
      message: "items deve ser um array não vazio",
    });
  }

  const normalized = items.map((item, index) => {
    const productId = Number(item?.productId);
    const quantity = Number(item?.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      errors.push({
        field: `items[${index}].productId`,
        message: "productId deve ser inteiro > 0",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.push({
        field: `items[${index}].quantity`,
        message: "quantity deve ser inteiro > 0",
      });
    }

    return { productId, quantity };
  });

  if (!clientRequestId) {
    errors.push({
      field: "clientRequestId",
      message: "clientRequestId é obrigatório (body ou header Idempotency-Key)",
    });
  }

  if (clientRequestId && clientRequestId.length > 80) {
    errors.push({
      field: "clientRequestId",
      message: "clientRequestId deve ter no máximo 80 caracteres",
    });
  }

  if (errors.length) {
    throw new ValidationError("Payload inválido", errors);
  }

  return {
    clientRequestId: clientRequestId || null,
    items: normalized,
  };
}
