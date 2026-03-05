import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado", details = null) {
    super({
      message,
      status: 404,
      code: "NOT_FOUND",
      details,
    });
  }
}
