import { useState } from "react";
import { createOrder } from "../services/ordersService";
import { toCreateOrderPayload } from "../utils/order";
import { isNetworkError, mapOrderApiErrorToMessage } from "../utils/orderErrors";

export function useCreateOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitOrder = async (cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { order: null, error: null, errorType: null };
    }

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

      return { order, error: null, errorType: null };
    } catch (error) {
      if (isNetworkError(error)) {
        return { order: null, error, errorType: "network" };
      }

      setErrorMessage(mapOrderApiErrorToMessage(error));
      return { order: null, error, errorType: "api" };
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
