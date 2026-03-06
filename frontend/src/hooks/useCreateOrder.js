import { useState } from "react";
import { createOrder } from "../services/ordersService";
import { toCreateOrderPayload } from "../utils/order";

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

export function useCreateOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitOrder = async (cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return null;

    setIsSubmitting(true);
    setResultMessage("");
    setErrorMessage("");

    try {
      const payload = toCreateOrderPayload(cartItems);
      const order = await createOrder(payload);

      if (order.reused) {
        setResultMessage(`Pedido #${order.id} já tinha sido registrado antes.`);
      } else {
        setResultMessage(`Pedido #${order.id} criado com sucesso.`);
      }

      return order;
    } catch (error) {
      if (error?.status === 409) {
        setErrorMessage(formatInsufficientStockMessage(error?.details));
      } else if (error?.status === 404) {
        setErrorMessage(
          error.message || "Um ou mais produtos do pedido não existem.",
        );
      } else if (error?.status === 400) {
        setErrorMessage(
          error.message ||
            "Pedido inválido. Verifique os itens e tente novamente.",
        );
      } else {
        setErrorMessage(error?.message || "Falha ao criar pedido.");
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    resultMessage,
    errorMessage,
    submitOrder,
    setResultMessage,
    setErrorMessage,
  };
}
