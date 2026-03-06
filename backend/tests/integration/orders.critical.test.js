import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import app from "../../src/app.js";
import { sequelize } from "../../src/config/database.js";
import {
  initModels,
  Input,
  Product,
  ProductInput,
} from "../../src/models/index.js";

let server;
let baseUrl;
let fixture;

function parseJsonSafe(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

async function request(path, init = {}) {
  const headers = {
    "content-type": "application/json",
    ...(init.headers || {}),
  };

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();

  return {
    status: response.status,
    body: parseJsonSafe(text),
    raw: text,
  };
}

async function createFixture() {
  const bacon = await Input.create({
    name: "Bacon Test",
    stockQty: 10,
    unit: "un",
  });

  const product = await Product.create({
    name: "X-Bacon Test",
    description: "Produto para testes críticos de pedido",
    price: 30,
  });

  await ProductInput.create({
    productId: product.id,
    inputId: bacon.id,
    qtyRequired: 2,
  });

  return {
    productId: product.id,
    baconInputId: bacon.id,
    baconStock: 10,
  };
}

async function getInputStock(inputId) {
  const response = await request("/api/inputs?page=1&limit=100");
  assert.equal(response.status, 200);

  const row = response.body?.data?.find((item) => item.id === inputId);
  assert.ok(row, `Insumo ${inputId} não encontrado`);

  return Number(row.stockQty);
}

before(async () => {
  initModels(sequelize);
  await sequelize.authenticate();

  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  fixture = await createFixture();
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await sequelize.close();
});

test("idempotência: mesmo clientRequestId não duplica pedido", async () => {
  const payload = {
    clientRequestId: `it-idem-${Date.now()}`,
    items: [{ productId: fixture.productId, quantity: 1 }],
  };

  const first = await request("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  assert.equal(first.status, 201);
  assert.equal(first.body?.reused, false);

  const second = await request("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  assert.equal(second.status, 200);
  assert.equal(second.body?.reused, true);
  assert.equal(second.body?.id, first.body?.id);

  const stockAfter = await getInputStock(fixture.baconInputId);
  assert.equal(stockAfter, fixture.baconStock - 2);
});

test("transação: pedido rejeitado por estoque não altera saldo", async () => {
  const payload = {
    clientRequestId: `it-stock-${Date.now()}`,
    items: [{ productId: fixture.productId, quantity: 6 }],
  };

  const response = await request("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  assert.equal(response.status, 409);
  assert.equal(response.body?.error, "INSUFFICIENT_STOCK");

  const stockAfter = await getInputStock(fixture.baconInputId);
  assert.equal(stockAfter, fixture.baconStock);
});

test("cancelamento: status CANCELED restaura estoque consumido", async () => {
  const createPayload = {
    clientRequestId: `it-cancel-${Date.now()}`,
    items: [{ productId: fixture.productId, quantity: 2 }],
  };

  const created = await request("/api/orders", {
    method: "POST",
    body: JSON.stringify(createPayload),
  });

  assert.equal(created.status, 201);

  const stockAfterCreate = await getInputStock(fixture.baconInputId);
  assert.equal(stockAfterCreate, fixture.baconStock - 4);

  const canceled = await request(`/api/orders/${created.body.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "CANCELED" }),
  });

  assert.equal(canceled.status, 200);
  assert.equal(canceled.body?.status, "CANCELED");

  const stockAfterCancel = await getInputStock(fixture.baconInputId);
  assert.equal(stockAfterCancel, fixture.baconStock);
});
