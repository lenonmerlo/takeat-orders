import { Link } from "react-router-dom";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import OrderStatusBadge from "./OrderStatusBadge";

function OrderList({ orders, onCancelOrder, isCancelingId }) {
  return (
    <div className="tk-panel overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-solid text-left text-sm text-slate-500">
            <th className="pb-3 pr-4">Pedido</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4">Total</th>
            <th className="pb-3 pr-4">Data</th>
            <th className="pb-3 pr-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-solid last:border-b-0"
            >
              <td className="py-3 pr-4 font-semibold">#{order.id}</td>
              <td className="py-3 pr-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="py-3 pr-4 font-semibold text-slate-800">
                {formatCurrency(order.total)}
              </td>
              <td className="py-3 pr-4 text-slate-600">
                {formatDateTime(order.createdAt)}
              </td>
              <td className="py-3 pr-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/orders/${order.id}`}
                    className="tk-btn tk-btn-ghost"
                  >
                    Ver detalhes
                  </Link>

                  {order.status === "CREATED" ? (
                    <button
                      type="button"
                      className="tk-btn tk-btn-ghost"
                      disabled={isCancelingId === order.id}
                      onClick={() => onCancelOrder?.(order.id)}
                    >
                      {isCancelingId === order.id
                        ? "Cancelando..."
                        : "Cancelar"}
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
