import { sequelize } from "../config/database.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import * as inputRepo from "../repositories/inputRepository.js";
import * as productRepo from "../repositories/productRepository.js";
import {
  buildPaginatedResponse,
  parsePagination,
} from "../utils/pagination.js";

export async function listProducts(query) {
  const pagination = parsePagination(query);
  const result = await productRepo.findAllWithRecipePaginated(pagination);
  return buildPaginatedResponse({
    rows: result.rows,
    count: result.count,
    page: pagination.page,
    limit: pagination.limit,
  });
}

export async function getProductById(id) {
  const product = await productRepo.findByIdWithRecipe(id);
  if (!product) throw new NotFoundError("Produto não encontrado");
  return product;
}

export async function createProduct(payload) {
  return productRepo.createProduct(payload);
}

export async function updateProduct(id, payload) {
  const product = await productRepo.findByIdWithRecipe(id);
  if (!product) throw new NotFoundError("Produto não encontrado");
  return productRepo.updateProduct(product, payload);
}

export async function updateRecipe(productId, recipeItems) {
  return sequelize.transaction(async (t) => {
    const product = await productRepo.findByIdWithRecipe(productId);
    if (!product) throw new NotFoundError("Produto não encontrado");

    const inputIds = recipeItems.map((r) => r.inputId);

    const inputs = await inputRepo.findInputsByIds(inputIds, t);

    if (inputs.length !== inputIds.length) {
      const found = new Set(inputs.map((i) => i.id));
      const missing = inputIds.filter((id) => !found.has(id));
      throw new NotFoundError("Um ou mais insumos não existem", {
        missingInputIds: missing,
      });
    }

    await productRepo.replaceRecipe({
      productId,
      recipeItems,
      transaction: t,
    });

    const updated = await productRepo.findByIdWithRecipe(productId);
    return updated;
  });
}
