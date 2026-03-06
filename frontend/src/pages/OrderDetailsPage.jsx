import { Link, useParams } from "react-router-dom";
import OrderDetails from "../components/orders/OrderDetails";
import { useOrderDetails } from "../hooks/useOrderDetails";

function OrderDetailsPage() {
  const { id } = useParams();
  const { order, isLoading, errorMessage } = useOrderDetails(id);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="tk-section-title mb-0">Detalhe do Pedido</h2>
        <Link to="/orders" className="tk-btn tk-btn-ghost">
          Voltar para Pedidos
        </Link>
      </div>

      {errorMessage ? (
        <div className="tk-alert tk-alert-danger">
          <p className="text-xl font-semibold">{errorMessage}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="tk-panel text-center">
          <p className="text-xl text-slate-500">Carregando pedido...</p>
        </div>
      ) : null}

      {!isLoading && order ? <OrderDetails order={order} /> : null}
    </section>
  );
}

export default OrderDetailsPage;
