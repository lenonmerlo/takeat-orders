import { productsMock } from "./mocks/products.mock";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

function normalizeProduct(product) {
  const rawPrice = Number(product.price ?? product.basePrice ?? 0);

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "Sem descrição",
    price: Number.isFinite(rawPrice) ? rawPrice : 0,
    status: "available",
  };
}

function normalizeProductsResponse(payload) {
  const list = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(list)) return [];
  return list.map(normalizeProduct);
}

export async function listProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products?page=1&limit=50`);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const payload = await response.json();
    const products = normalizeProductsResponse(payload);

    if (products.length === 0) return productsMock;
    return products;
  } catch {
    return productsMock;
  }
}
