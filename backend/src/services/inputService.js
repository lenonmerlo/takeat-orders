import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import * as inputRepo from "../repositories/inputRepository.js";
import {
  buildPaginatedResponse,
  parsePagination,
} from "../utils/pagination.js";

export async function listInputs(query) {
  const pagination = parsePagination(query);
  const result = await inputRepo.findAllPaginated(pagination);
  return buildPaginatedResponse({
    rows: result.rows,
    count: result.count,
    page: pagination.page,
    limit: pagination.limit,
  });
}

export async function createInput(payload) {
  const exists = await inputRepo.findByName(payload.name);
  if (exists) {
    throw new ValidationError("Já existe um insumo com esse nome", [
      { field: "name", message: "name já existe" },
    ]);
  }
  return inputRepo.createInput(payload);
}

export async function updateStock(id, stockChange) {
  const input = await inputRepo.findById(id);
  if (!input) throw new NotFoundError("Insumo não encontrado");

  if (stockChange.mode === "set") {
    input.stockQty = stockChange.stockQty;
    return inputRepo.save(input);
  }
  
  const next = input.stockQty + stockChange.delta;
  if (next < 0) {
    throw new ValidationError("Estoque não pode ficar negativo", [
      {
        field: "delta",
        message: `estoque atual ${input.stockQty}, delta ${stockChange.delta}`,
      },
    ]);
  }

  input.stockQty = next;
  return inputRepo.save(input);
}
