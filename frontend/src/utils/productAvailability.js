export function getProductAvailability(product) {
  const inputs = Array.isArray(product.inputs) ? product.inputs : [];

  if (!inputs.length) {
    return {
      status: "available",
      label: "Disponível",
    };
  }

  const capacities = inputs.map((input) => {
    const stockQty = Number(input.stockQty ?? 0);
    const qtyRequired = Number(
      input.qtyRequired ?? input.ProductInput?.qtyRequired ?? 0,
    );

    if (!Number.isFinite(stockQty) || stockQty < 0) return 0;
    if (!Number.isFinite(qtyRequired) || qtyRequired <= 0) return 0;

    return Math.floor(stockQty / qtyRequired);
  });

  const minCapacity = Math.min(...capacities);

  if (minCapacity <= 0) {
    return {
      status: "unavailable",
      label: "Indisponível",
    };
  }

  if (minCapacity <= 3) {
    return {
      status: "low",
      label: "Estoque Baixo",
    };
  }

  return {
    status: "available",
    label: "Disponível",
  };
}

export function buildRecipeSummary(product) {
  const inputs = Array.isArray(product.inputs) ? product.inputs : [];

  if (!inputs.length) {
    return "Sem ficha técnica cadastrada";
  }

  const names = inputs
    .map((input) => input.name)
    .filter(Boolean)
    .slice(0, 3);

  return names.length ? names.join(", ") : "Ficha técnica cadastrada";
}
