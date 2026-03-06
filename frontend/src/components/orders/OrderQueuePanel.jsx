import { formatDateTime } from "../../utils/formatters";

function getQueueClass(status) {
  if (status === "failed") return "tk-queue-item tk-queue-failed";
  if (status === "syncing") return "tk-queue-item tk-queue-syncing";
  return "tk-queue-item tk-queue-pending";
}

function getQueueLabel(status) {
  if (status === "failed") return "Falhou na sincronização";
  if (status === "syncing") return "Sincronizando";
  if (status === "synced") return "Sincronizado";
  return "Pendente";
}

function summarizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) return "Sem itens";

  const total = items.reduce(
    (acc, item) => acc + Number(item.quantity ?? 0),
    0,
  );
  return `${items.length} produto(s), ${total} item(ns)`;
}

function OrderQueuePanel({
  queueItems,
  isSyncing,
  onSync,
  onDismiss,
  onClearSynced,
}) {
  if (!Array.isArray(queueItems) || queueItems.length === 0) return null;

  return (
    <section className="tk-panel mt-4">
      <div className="mb-4 flex flex-col gap-3 border-b border-solid pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Fila Offline</h3>
          <p className="text-sm text-slate-500">
            Pedidos aguardando internet ou com falha tardia de estoque.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 md:w-auto">
          <button
            type="button"
            className="tk-btn tk-btn-ghost flex-1 px-3 py-2 text-sm md:flex-none md:text-base"
            onClick={onClearSynced}
          >
            Limpar sincronizados
          </button>
          <button
            type="button"
            className="tk-btn tk-btn-primary flex-1 px-3 py-2 text-sm md:flex-none md:text-base"
            onClick={onSync}
            disabled={isSyncing}
          >
            {isSyncing ? "Sincronizando..." : "Sincronizar fila"}
          </button>
        </div>
      </div>

      <div>
        {queueItems.map((item) => (
          <div
            key={item.id}
            className={
              item.status === "synced"
                ? "mb-3 rounded-lg border border-solid border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
                : getQueueClass(item.status)
            }
          >
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2 md:gap-3">
              <p className="font-semibold">{getQueueLabel(item.status)}</p>
              <button
                type="button"
                className="tk-btn tk-btn-ghost px-3 py-1 text-sm"
                onClick={() => onDismiss?.(item.id)}
              >
                Remover
              </button>
            </div>

            <p className="text-sm">
              Criado em {formatDateTime(item.createdAt)} •{" "}
              {summarizeItems(item.payload?.items)}
            </p>

            {item.status === "synced" && item.syncedOrderId ? (
              <p className="mt-1 text-sm font-medium">
                Pedido processado como #{item.syncedOrderId}.
              </p>
            ) : null}

            {item.status === "failed" && item.errorMessage ? (
              <p className="mt-2 whitespace-pre-line text-sm">
                {item.errorMessage}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default OrderQueuePanel;
