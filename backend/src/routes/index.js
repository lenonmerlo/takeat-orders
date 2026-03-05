import { Router } from "express";
import productsRoutes from "./products.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
router.use("/products", productsRoutes);

export default router;
