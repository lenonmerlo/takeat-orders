export function buildClientRequestId() {
  return `web-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function toCreateOrderPayload(cartItems) {
  return {
    clientRequestId: buildClientRequestId(),
    items: cartItems.map((item) => ({
      productId: Number(item.id),
      quantity: Number(item.quantity),
    })),
  };
}
