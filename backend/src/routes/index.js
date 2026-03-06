import { Router } from "express";
import inputsRoutes from "./inputs.routes.js";
import ordersRoutes from "./orders.routes.js";
import productsRoutes from "./products.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/products", productsRoutes);
router.use("/inputs", inputsRoutes);
router.use("/orders", ordersRoutes);

export default router;