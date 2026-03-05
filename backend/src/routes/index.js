import { Router } from "express";
import inputsRoutes from "./inputs.routes.js";
import productsRoutes from "./products.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
router.use("/products", productsRoutes);
router.use("/inputs", inputsRoutes);

export default router;
