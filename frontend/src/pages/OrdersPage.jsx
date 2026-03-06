import OrderSummaryPanel from "../components/cart/OrderSummaryPanel";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/shared/SearchBar";
import { cartItemsMock, queueItemsMock } from "../services/mocks/orders.mock";
import { productsMock } from "../services/mocks/products.mock";

function getQueueClass(status) {
  if (status === "syncing") return "tk-queue-syncing";
  if (status === "failed") return "tk-queue-failed";
  return "tk-queue-pending";
}

function getQueueLabel(status) {
  if (status === "syncing") return "Sincronizando";
  if (status === "failed") return "Falhou";
  return "Aguardando";
}

function OrdersPage() {
  const suggestedProducts = productsMock.slice(0, 2);

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
      <div>
        <SearchBar />

        <div className="tk-alert tk-alert-danger mb-5">
          <h3 className="mb-2 text-2xl font-semibold">
            ⚠ Estoque Insuficiente
          </h3>
          <p className="mb-2 text-xl">
            Não há ingredientes suficientes para concluir este pedido. O estoque
            de Bacon está insuficiente.
          </p>
          <p className="mb-4 text-xl">
            O produto <strong>X-Bacon</strong> não possui estoque suficiente
            para completar este pedido.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="tk-btn tk-btn-ghost">
              Remover do Pedido
            </button>
            <button type="button" className="tk-btn tk-btn-ghost">
              Tentar Novamente
            </button>
          </div>
        </div>

        <section className="tk-alert tk-alert-warning mb-5">
          <h3 className="mb-4 text-4xl font-semibold">
            📡 Fila de Sincronização
          </h3>
          <p className="mb-4 text-xl">
            Os pedidos abaixo serão enviados automaticamente quando a conexão
            for restabelecida.
          </p>

          {queueItemsMock.map((item) => (
            <div
              key={item.id}
              className={`tk-queue-item ${getQueueClass(item.status)}`}
            >
              <div className="mb-1 flex items-center gap-3">
                <span className="text-xl font-semibold">Pedido #{item.id}</span>
                <span className="tk-badge">{getQueueLabel(item.status)}</span>
              </div>
              <p className="text-lg">{item.info}</p>
              {item.reason ? (
                <p className="mt-2 text-lg font-medium">{item.reason}</p>
              ) : null}
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {suggestedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <aside>
        <OrderSummaryPanel items={cartItemsMock} />
      </aside>
    </section>
  );
}

export default OrdersPage;
