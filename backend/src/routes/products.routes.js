import { Router } from "express";
import {
  createProduct,
  getProduct,
  listProducts,
  updateProduct,
  updateRecipe,
} from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);

router.post("/", createProduct);
router.put("/:id", updateProduct);

router.put("/:id/recipe", updateRecipe);

export default router;
