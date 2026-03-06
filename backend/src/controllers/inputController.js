import * as inputService from "../services/inputService.js";
import {
  validateCreateInputPayload,
  validateUpdateStockPayload,
} from "../validators/inputValidator.js";

export async function listInputs(req, res, next) {
  try {
    const inputs = await inputService.listInputs(req.query);
    res.json(inputs);
  } catch (error) {
    next(error);
  }
}

export async function createInput(req, res, next) {
  try {
    const payload = validateCreateInputPayload(req.body);
    const created = await inputService.createInput(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function updateStock(req, res, next) {
  try {
    const id = Number(req.params.id);
    const stockChange = validateUpdateStockPayload(req.body);
    const updated = await inputService.updateStock(id, stockChange);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
