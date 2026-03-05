import { Router } from "express";
import {
  createInput,
  listInputs,
  updateStock,
} from "../controllers/inputController.js";

const router = Router();

router.get("/", listInputs);
router.post("/", createInput);
router.patch("/:id/stock", updateStock);

export default router;
