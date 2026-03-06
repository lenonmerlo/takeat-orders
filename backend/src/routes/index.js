import { Router } from "express";
import { sequelize } from "../config/database.js";
import inputsRoutes from "./inputs.routes.js";
import ordersRoutes from "./orders.routes.js";
import productsRoutes from "./products.routes.js";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ok", db: "up" });
  } catch {
    res.status(503).json({ status: "degraded", db: "down" });
  }
});

router.use("/products", productsRoutes);
router.use("/inputs", inputsRoutes);
router.use("/orders", ordersRoutes);

export default router;