import * as productService from "../services/productService.js";
import {
  validateCreateProductPayload,
  validateRecipePayload,
  validateUpdateProductPayload,
} from "../validators/productValidator.js";

export async function listProducts(req, res, next) {
  try {
    const products = await productService.listProducts(req.query);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const payload = validateCreateProductPayload(req.body);
    const created = await productService.createProduct(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const payload = validateUpdateProductPayload(req.body);
    const updated = await productService.updateProduct(id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function updateRecipe(req, res, next) {
  try {
    const productId = Number(req.params.id);
    const recipeItems = validateRecipePayload(req.body);
    const updated = await productService.updateRecipe(productId, recipeItems);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
