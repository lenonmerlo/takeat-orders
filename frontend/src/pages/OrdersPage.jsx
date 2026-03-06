import { Link } from "react-router-dom";
import OrderList from "../components/orders/OrderList";
import { useOrders } from "../hooks/useOrders";

function OrdersPage() {
  const {
    orders,
    meta,
    isLoading,
    errorMessage,
    actionMessage,
    isCancelingId,
    cancelOrder,
  } = useOrders();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="tk-section-title mb-0">Pedidos</h2>
        <Link to="/products" className="tk-btn tk-btn-ghost">
          Voltar para Produtos
        </Link>
      </div>

      {errorMessage ? (
        <div className="tk-alert tk-alert-danger">
          <p className="text-xl font-semibold">{errorMessage}</p>
        </div>
      ) : null}

      {actionMessage ? (
        <div className="rounded-xl border border-solid border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <p className="text-xl font-semibold">{actionMessage}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="tk-panel text-center">
          <p className="text-xl text-slate-500">Carregando pedidos...</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && orders.length === 0 ? (
        <div className="tk-panel text-center">
          <p className="text-xl text-slate-500">Nenhum pedido encontrado.</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && orders.length > 0 ? (
        <>
          <OrderList
            orders={orders}
            onCancelOrder={cancelOrder}
            isCancelingId={isCancelingId}
          />
          {meta ? (
            <p className="text-sm text-slate-500">
              Página {meta.page} de {meta.totalPages} • Total: {meta.total}
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export default OrdersPage;
