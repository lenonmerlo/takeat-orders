import { Op } from "sequelize";
import { Input } from "../models/index.js";

export async function findAll() {
  return Input.findAll({ order: [["id", "ASC"]] });
}

export async function findAllPaginated({ limit, offset }) {
  return Input.findAndCountAll({
    order: [["id", "ASC"]],
    limit,
    offset,
  });
}

export async function findById(id, transaction) {
  return Input.findByPk(id, { transaction });
}

export async function findByName(name) {
  return Input.findOne({ where: { name } });
}

export async function createInput(data) {
  return Input.create(data);
}

export async function save(input, transaction) {
  await input.save({ transaction });
  return input;
}

export async function findByIdsForUpdate(ids, transaction) {
  return Input.findAll({
    where: { id: { [Op.in]: ids } },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
}
