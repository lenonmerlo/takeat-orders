import { ValidationError } from "../errors/ValidationError.js";

export function validateCreateProductPayload(body) {
  const errors = [];

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : undefined;
  const price = body?.price;

  if (!name) errors.push({ field: "name", message: "name é obrigatório" });

  const priceNumber = Number(price);
  if (Number.isNaN(priceNumber) || priceNumber < 0) {
    errors.push({ field: "price", message: "price deve ser um número >= 0" });
  }

  if (typeof description === "string" && !description) {
    errors.push({
      field: "description",
      message: "description não pode ser vazia",
    });
  }

  if (errors.length) throw new ValidationError("Payload inválido", errors);

  return {
    name,
    description: typeof description === "string" ? description : null,
    price: priceNumber,
  };
}

export function validateUpdateProductPayload(body) {
  const errors = [];
  const payload = {};

  if ("name" in body) {
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name)
      errors.push({ field: "name", message: "name não pode ser vazio" });
    else payload.name = name;
  }

  if ("price" in body) {
    const priceNumber = Number(body?.price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      errors.push({ field: "price", message: "price deve ser um número > 0" });
    } else {
      payload.price = priceNumber;
    }
  }

  if ("description" in body) {
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";
    if (!description) {
      errors.push({
        field: "description",
        message: "description não pode ser vazia",
      });
    } else {
      payload.description = description;
    }
  }

  if (!Object.keys(payload).length) {
    errors.push({
      field: "body",
      message: "informe ao menos name, description ou price",
    });
  }

  if (errors.length) throw new ValidationError("Payload inválido", errors);

  return payload;
}

export function validateRecipePayload(body) {
  const errors = [];
  const inputs = Array.isArray(body?.inputs) ? body.inputs : [];

  if (!inputs.length)
    errors.push({
      field: "inputs",
      message: "inputs deve ser um array não vazio",
    });

  const normalized = inputs.map((i, idx) => {
    const inputId = Number(i?.inputId);
    const qtyRequired = Number(i?.qtyRequired);

    if (!Number.isInteger(inputId) || inputId <= 0) {
      errors.push({
        field: `inputs[${idx}].inputId`,
        message: "inputId deve ser inteiro > 0",
      });
    }
    if (!Number.isFinite(qtyRequired) || qtyRequired <= 0) {
      errors.push({
        field: `inputs[${idx}].qtyRequired`,
        message: "qtyRequired deve ser > 0",
      });
    }

    return { inputId, qtyRequired };
  });

  const seen = new Set();
  for (const item of normalized) {
    if (seen.has(item.inputId)) {
      errors.push({
        field: "inputs",
        message: `inputId duplicado: ${item.inputId}`,
      });
    }
    seen.add(item.inputId);
  }

  if (errors.length) throw new ValidationError("Payload inválido", errors);

  return normalized;
}
