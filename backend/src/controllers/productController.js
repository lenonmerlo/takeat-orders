import { Input, Product } from "../models/index.js";

export async function listProducts(req, res, next) {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Input,
          as: "inputs",
          through: { attributes: ["qtyRequired"] },
        },
      ],
      order: [["id", "ASC"]],
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
}
