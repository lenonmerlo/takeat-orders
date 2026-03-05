import { Input } from "../models/index.js";

export async function findInputsByIds(ids, transaction) {
  return Input.findAll({
    where: { id: ids },
    transaction,
  });
}
