export function formatInsufficientStockMessage(details) {
  if (!Array.isArray(details) || details.length === 0) {
    return "Faltam insumos para concluir este pedido agora. Tente ajustar as quantidades.";
  }

  const lines = details
    .map((item) => {
      const name = item?.name || `Insumo #${item?.inputId ?? "?"}`;
      const required = Number(item?.required ?? 0);
      const available = Number(item?.available ?? 0);

      return `• ${name}: precisa ${required} e tem ${available}.`;
    })
    .join("\n");

  return `Faltam insumos para concluir este pedido agora.\n\nConfira o que está em falta:\n${lines}`;
}

export function mapOrderApiErrorToMessage(error) {
  if (error?.status === 409) {
    return formatInsufficientStockMessage(error?.details);
  }

  if (error?.status === 404) {
    return error.message || "Um ou mais produtos do pedido não existem.";
  }

  if (error?.status === 400) {
    return (
      error.message || "Pedido inválido. Verifique os itens e tente novamente."
    );
  }

  return error?.message || "Falha ao criar pedido.";
}

export function isNetworkError(error) {
  if (!error) return false;
  if (typeof error?.status === "number") return false;

  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("fetch")
  );
}
