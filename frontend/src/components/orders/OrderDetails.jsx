import { formatCurrency, formatDateTime } from "../../utils/formatters";
import OrderStatusBadge from "./OrderStatusBadge";

function OrderDetails({ order }) {
  return (
    <section className="grid grid-cols-1 gap-5">
      <div className="tk-panel">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-solid pb-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Pedido #{order.id}
            </h2>
            <p className="text-slate-500">{formatDateTime(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Client Request Id</p>
            <p className="text-lg font-semibold text-slate-800">
              {order.clientRequestId}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-[#c81e3a]">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="tk-panel">
        <h3 className="mb-4 text-2xl font-semibold text-slate-900">
          Itens do pedido
        </h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id ?? `${item.productId}-${item.quantity}`}
              className="tk-cart-line"
            >
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {item.product?.name || `Produto #${item.productId}`}
                </p>
                <p className="text-sm text-slate-500">
                  Qtd: {item.quantity} • Unitário:{" "}
                  {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="text-lg font-semibold text-slate-800">
                {formatCurrency(item.lineTotal)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrderDetails;
