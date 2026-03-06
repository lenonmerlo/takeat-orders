import {
  buildRecipeSummary,
  getProductAvailability,
} from "../utils/productAvailability";
import { apiRequest } from "./api";

function normalizeProduct(product) {
  const rawPrice = Number(product.price ?? product.basePrice ?? 0);
  const availability = getProductAvailability(product);

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "Sem descrição",
    price: Number.isFinite(rawPrice) ? rawPrice : 0,
    status: availability.status,
    availabilityLabel: availability.label,
    recipeSummary: buildRecipeSummary(product),
    inputs: Array.isArray(product.inputs) ? product.inputs : [],
  };
}

function normalizeProductsResponse(payload) {
  const list = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(list)) return [];
  return list.map(normalizeProduct);
}

export async function listProducts({ page = 1, limit = 50 } = {}) {
  const payload = await apiRequest(`/products?page=${page}&limit=${limit}`);
  return normalizeProductsResponse(payload);
}

export async function getProductById(id) {
  const payload = await apiRequest(`/products/${id}`);
  return normalizeProduct(payload);
}
