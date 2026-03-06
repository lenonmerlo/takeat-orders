import "dotenv/config";
import { sequelize } from "../config/database.js";
import { initModels, Input, Product, ProductInput } from "../models/index.js";

async function seed() {
  await sequelize.authenticate();
  initModels(sequelize);
  await sequelize.sync({ force: true });

  const inputCatalog = [
    { name: "Pão Brioche", stockQty: 120, unit: "un" },
    { name: "Carne Bovina", stockQty: 90, unit: "un" },
    { name: "Queijo Cheddar", stockQty: 120, unit: "un" },
    { name: "Alface", stockQty: 90, unit: "un" },
    { name: "Tomate", stockQty: 90, unit: "un" },
    { name: "Bacon", stockQty: 8, unit: "un" },
    { name: "Ovo", stockQty: 70, unit: "un" },
    { name: "Molho Especial", stockQty: 110, unit: "un" },
    { name: "Frango Empanado", stockQty: 70, unit: "un" },
    { name: "Batata", stockQty: 180, unit: "un" },
    { name: "Óleo", stockQty: 160, unit: "un" },
    { name: "Sal", stockQty: 220, unit: "un" },
    { name: "Cebola", stockQty: 0, unit: "un" },
    { name: "Farinha", stockQty: 120, unit: "un" },
    { name: "Nuggets", stockQty: 100, unit: "un" },
    { name: "Lata Refrigerante", stockQty: 4, unit: "un" },
    { name: "Polpa de Laranja", stockQty: 90, unit: "un" },
    { name: "Água Filtrada", stockQty: 250, unit: "un" },
    { name: "Gelo", stockQty: 180, unit: "un" },
  ];

  const inputs = await Input.bulkCreate(inputCatalog, { returning: true });
  const inputByName = Object.fromEntries(
    inputs.map((item) => [item.name, item]),
  );

  const productCatalog = [
    {
      name: "X-Burger Clássico",
      description: "Hambúrguer bovino suculento com cheddar no pão brioche.",
      price: 25.0,
      recipe: [
        { inputName: "Pão Brioche", qtyRequired: 1 },
        { inputName: "Carne Bovina", qtyRequired: 1 },
        { inputName: "Queijo Cheddar", qtyRequired: 1 },
        { inputName: "Molho Especial", qtyRequired: 1 },
      ],
    },
    {
      name: "X-Salada",
      description: "Burger com alface fresca, tomate e molho especial da casa.",
      price: 28.0,
      recipe: [
        { inputName: "Pão Brioche", qtyRequired: 1 },
        { inputName: "Carne Bovina", qtyRequired: 1 },
        { inputName: "Queijo Cheddar", qtyRequired: 1 },
        { inputName: "Alface", qtyRequired: 1 },
        { inputName: "Tomate", qtyRequired: 1 },
      ],
    },
    {
      name: "X-Bacon",
      description:
        "Combinação intensa de burger, cheddar e bacon crocante (estoque limitado).",
      price: 31.0,
      recipe: [
        { inputName: "Pão Brioche", qtyRequired: 1 },
        { inputName: "Carne Bovina", qtyRequired: 1 },
        { inputName: "Queijo Cheddar", qtyRequired: 1 },
        { inputName: "Bacon", qtyRequired: 2 },
        { inputName: "Molho Especial", qtyRequired: 1 },
      ],
    },
    {
      name: "X-Egg",
      description: "Burger artesanal com ovo grelhado e cheddar derretido.",
      price: 32.0,
      recipe: [
        { inputName: "Pão Brioche", qtyRequired: 1 },
        { inputName: "Carne Bovina", qtyRequired: 1 },
        { inputName: "Queijo Cheddar", qtyRequired: 1 },
        { inputName: "Ovo", qtyRequired: 1 },
      ],
    },
    {
      name: "X-Tudo",
      description: "Sanduíche completo com bacon, ovo, salada e muito sabor.",
      price: 38.0,
      recipe: [
        { inputName: "Pão Brioche", qtyRequired: 1 },
        { inputName: "Carne Bovina", qtyRequired: 2 },
        { inputName: "Queijo Cheddar", qtyRequired: 2 },
        { inputName: "Bacon", qtyRequired: 2 },
        { inputName: "Ovo", qtyRequired: 1 },
        { inputName: "Alface", qtyRequired: 1 },
        { inputName: "Tomate", qtyRequired: 1 },
        { inputName: "Molho Especial", qtyRequired: 1 },
      ],
    },
    {
      name: "X-Frango Crispy",
      description:
        "Filé de frango empanado, crocante por fora e macio por dentro.",
      price: 29.0,
      recipe: [
        { inputName: "Pão Brioche", qtyRequired: 1 },
        { inputName: "Frango Empanado", qtyRequired: 1 },
        { inputName: "Queijo Cheddar", qtyRequired: 1 },
        { inputName: "Alface", qtyRequired: 1 },
        { inputName: "Molho Especial", qtyRequired: 1 },
      ],
    },
    {
      name: "Batata Frita P",
      description: "Porção individual de batata frita dourada e sequinha.",
      price: 12.0,
      recipe: [
        { inputName: "Batata", qtyRequired: 3 },
        { inputName: "Óleo", qtyRequired: 1 },
        { inputName: "Sal", qtyRequired: 1 },
      ],
    },
    {
      name: "Batata Frita G",
      description: "Porção grande para compartilhar, perfeita para combos.",
      price: 19.0,
      recipe: [
        { inputName: "Batata", qtyRequired: 5 },
        { inputName: "Óleo", qtyRequired: 2 },
        { inputName: "Sal", qtyRequired: 1 },
      ],
    },
    {
      name: "Onion Rings",
      description:
        "Anéis de cebola empanados e crocantes, ótimo acompanhamento.",
      price: 16.0,
      recipe: [
        { inputName: "Cebola", qtyRequired: 3 },
        { inputName: "Farinha", qtyRequired: 1 },
        { inputName: "Óleo", qtyRequired: 1 },
        { inputName: "Sal", qtyRequired: 1 },
      ],
    },
    {
      name: "Nuggets 10 Unidades",
      description:
        "Nuggets crocantes servidos quentinhos para o pedido sair rápido.",
      price: 21.0,
      recipe: [
        { inputName: "Nuggets", qtyRequired: 10 },
        { inputName: "Óleo", qtyRequired: 1 },
      ],
    },
    {
      name: "Refrigerante Cola 350ml",
      description:
        "Lata gelada para completar o combo do cliente (estoque limitado).",
      price: 8.0,
      recipe: [{ inputName: "Lata Refrigerante", qtyRequired: 1 }],
    },
    {
      name: "Suco de Laranja 500ml",
      description: "Suco refrescante preparado na hora com gelo.",
      price: 11.0,
      recipe: [
        { inputName: "Polpa de Laranja", qtyRequired: 1 },
        { inputName: "Água Filtrada", qtyRequired: 1 },
        { inputName: "Gelo", qtyRequired: 2 },
      ],
    },
  ];

  const products = await Product.bulkCreate(
    productCatalog.map(({ recipe, ...product }) => product),
    { returning: true },
  );

  const productByName = Object.fromEntries(
    products.map((product) => [product.name, product]),
  );

  const recipeRows = productCatalog.flatMap((product) =>
    product.recipe.map((recipeItem) => ({
      productId: productByName[product.name].id,
      inputId: inputByName[recipeItem.inputName].id,
      qtyRequired: recipeItem.qtyRequired,
    })),
  );

  await ProductInput.bulkCreate(recipeRows);

  console.log(
    `Seed finalizado com sucesso! ${products.length} produtos e ${inputs.length} insumos cadastrados.`,
  );
  await sequelize.close();
}

seed().catch(async (err) => {
  console.error("Seed falhou:", err);
  try {
    await sequelize.close();
  } catch {}
  process.exit(1);
});
