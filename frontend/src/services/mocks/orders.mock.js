export const cartItemsMock = [
  { id: "c1", name: "X-Bacon", price: 32.9, quantity: 2 },
  { id: "c2", name: "Batata Frita", price: 18.9, quantity: 1 },
];

export const queueItemsMock = [
  {
    id: 101,
    status: "pending",
    info: "3 itens • 13:29",
  },
  {
    id: 102,
    status: "syncing",
    info: "2 itens • 13:32",
  },
  {
    id: 103,
    status: "failed",
    info: "5 itens • 13:33",
    reason: "Estoque insuficiente de Carne",
  },
];
