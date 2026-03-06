import { useEffect, useState } from "react";
import { cancelOrder, listOrders } from "../services/ordersService";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isCancelingId, setIsCancelingId] = useState(null);

  async function loadOrders() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await listOrders({ page: 1, limit: 20 });
      setOrders(result.data);
      setMeta(result.meta);
    } catch (error) {
      setOrders([]);
      setMeta(null);
      setErrorMessage(
        error?.message || "Não foi possível carregar os pedidos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleCancelOrder(orderId) {
    setActionMessage("");
    setErrorMessage("");
    setIsCancelingId(orderId);

    try {
      const updated = await cancelOrder(orderId);
      setOrders((current) =>
        current.map((order) => (order.id === updated.id ? updated : order)),
      );
      setActionMessage(`Pedido #${updated.id} cancelado com sucesso.`);
      return updated;
    } catch (error) {
      setErrorMessage(error?.message || "Não foi possível cancelar o pedido.");
      return null;
    } finally {
      setIsCancelingId(null);
    }
  }

  return {
    orders,
    meta,
    isLoading,
    errorMessage,
    actionMessage,
    isCancelingId,
    cancelOrder: handleCancelOrder,
    reloadOrders: loadOrders,
  };
}
