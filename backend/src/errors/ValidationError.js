import { AppError } from "./AppError.js";

export class ValidationError extends AppError {
  constructor(message = "Payload inválido", details = null) {
    super({
      message,
      status: 400,
      code: "VALIDATION_ERROR",
      details,
    });
  }
}
