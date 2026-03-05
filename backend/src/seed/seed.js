import "dotenv/config";
import { sequelize } from "../config/database.js";
import { initModels, Input, Product, ProductInput } from "../models/index.js";

async function seed() {
  await sequelize.authenticate();
  initModels(sequelize);
  await sequelize.sync({ force: true });

  const [pao, carne, queijo, alface] = await Promise.all([
    Input.create({ name: "Pão", stockQty: 10, unit: "un" }),
    Input.create({ name: "Carne", stockQty: 5, unit: "un" }),
    Input.create({ name: "Queijo", stockQty: 8, unit: "un" }),
    Input.create({ name: "Alface", stockQty: 6, unit: "un" }),
    Input.create({ name: "Bacon", stockQty: 6, unit: "un" }),
    Input.create({ name: "Ovo", stockQty: 8, unit: "un" }),
    Input.create({ name: "Tomate", stockQty: 10, unit: "un" }),
  ]);

  const [xBurger, xSalada] = await Promise.all([
    Product.create({ name: "X-Burger", price: 25.0 }),
    Product.create({ name: "X-Salada", price: 28.0 }),
  ]);

  await Promise.all([
    ProductInput.create({
      productId: xBurger.id,
      inputId: pao.id,
      qtyRequired: 1,
    }),
    ProductInput.create({
      productId: xBurger.id,
      inputId: carne.id,
      qtyRequired: 1,
    }),
    ProductInput.create({
      productId: xBurger.id,
      inputId: queijo.id,
      qtyRequired: 1,
    }),

    ProductInput.create({
      productId: xSalada.id,
      inputId: pao.id,
      qtyRequired: 1,
    }),
    ProductInput.create({
      productId: xSalada.id,
      inputId: carne.id,
      qtyRequired: 1,
    }),
    ProductInput.create({
      productId: xSalada.id,
      inputId: queijo.id,
      qtyRequired: 1,
    }),
    ProductInput.create({
      productId: xSalada.id,
      inputId: alface.id,
      qtyRequired: 1,
    }),
  ]);

  console.log("Seed finalizado com sucesso!");
  await sequelize.close();
}

seed().catch(async (err) => {
  console.error("Seed falhou:", err);
  try {
    await sequelize.close();
  } catch {}
  process.exit(1);
});
