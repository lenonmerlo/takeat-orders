import { Op } from "sequelize";
import { Input, Product, ProductInput } from "../models/index.js";

export async function findAllWithRecipe() {
  return Product.findAll({
    include: [
      { model: Input, as: "inputs", through: { attributes: ["qtyRequired"] } },
    ],
    order: [["id", "ASC"]],
  });
}

export async function findAllWithRecipePaginated({ limit, offset }) {
  return Product.findAndCountAll({
    include: [
      { model: Input, as: "inputs", through: { attributes: ["qtyRequired"] } },
    ],
    order: [["id", "ASC"]],
    limit,
    offset,
    distinct: true,
  });
}

export async function findByIdWithRecipe(id) {
  return Product.findByPk(id, {
    include: [
      { model: Input, as: "inputs", through: { attributes: ["qtyRequired"] } },
    ],
  });
}

export async function createProduct(data) {
  return Product.create(data);
}

export async function updateProduct(product, data) {
  await product.update(data);
  return product;
}

export async function replaceRecipe({ productId, recipeItems, transaction }) {
  await ProductInput.destroy({ where: { productId }, transaction });

  if (recipeItems.length) {
    await ProductInput.bulkCreate(
      recipeItems.map((r) => ({
        productId,
        inputId: r.inputId,
        qtyRequired: r.qtyRequired,
      })),
      { transaction },
    );
  }
}

export async function findByIdsWithRecipe(ids, transaction) {
  return Product.findAll({
    where: { id: { [Op.in]: ids } },
    include: [
      {
        model: Input,
        as: "inputs",
        through: { attributes: ["qtyRequired"] },
      },
    ],
    transaction,
  });
}
