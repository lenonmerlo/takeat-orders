import { useEffect, useState } from "react";
import { getOrderById } from "../services/ordersService";

export function useOrderDetails(orderId) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setIsLoading(false);
      setErrorMessage("Pedido inválido.");
      return;
    }

    async function load() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getOrderById(orderId);
        setOrder(response);
      } catch (error) {
        setOrder(null);
        setErrorMessage(
          error?.message || "Não foi possível carregar o pedido.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [orderId]);

  return {
    order,
    isLoading,
    errorMessage,
  };
}
