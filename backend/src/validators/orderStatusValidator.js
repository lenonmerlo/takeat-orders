import { ValidationError } from "../errors/ValidationError.js";

const ALLOWED_ORDER_STATUS = ["CREATED", "CANCELED"];

export function validateUpdateOrderStatusPayload(body) {
  const status =
    typeof body?.status === "string" ? body.status.trim().toUpperCase() : "";

  if (!status || !ALLOWED_ORDER_STATUS.includes(status)) {
    throw new ValidationError("Payload inválido", [
      {
        field: "status",
        message: `status deve ser um de: ${ALLOWED_ORDER_STATUS.join(", ")}`,
      },
    ]);
  }

  return { status };
}
