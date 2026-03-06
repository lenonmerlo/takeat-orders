import { apiRequest } from "./api";

function normalizeOrder(order) {
  return {
    id: order.id,
    clientRequestId: order.clientRequestId,
    status: order.status,
    total: Number(order.total ?? 0),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    reused: Boolean(order.reused),
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          id: item.id,
          productId: item.productId ?? item.product_id,
          quantity: Number(item.qty ?? 0),
          unitPrice: Number(item.unitPrice ?? 0),
          lineTotal: Number(item.lineTotal ?? 0),
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                price: Number(item.product.price ?? 0),
              }
            : null,
        }))
      : [],
  };
}

export async function createOrder({ items, clientRequestId }) {
  const payload = await apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify({ clientRequestId, items }),
  });

  return normalizeOrder(payload);
}

export async function listOrders({ page = 1, limit = 20 } = {}) {
  const payload = await apiRequest(`/orders?page=${page}&limit=${limit}`);

  const rows = Array.isArray(payload?.data) ? payload.data : [];

  return {
    data: rows.map(normalizeOrder),
    meta: payload?.meta ?? null,
  };
}

export async function getOrderById(id) {
  const payload = await apiRequest(`/orders/${id}`);
  return normalizeOrder(payload);
}

export async function updateOrderStatus(id, status) {
  const payload = await apiRequest(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  return normalizeOrder(payload);
}

export async function cancelOrder(id) {
  return updateOrderStatus(id, "CANCELED");
}
