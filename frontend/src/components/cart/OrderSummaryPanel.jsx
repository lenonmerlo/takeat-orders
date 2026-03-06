import { ShoppingCart, Trash2 } from "lucide-react";

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function OrderSummaryPanel({
  items = [],
  title = "Pedido Atual",
  showActions = true,
  onDecrease,
  onIncrease,
  onRemove,
  onSubmit,
  onClear,
  submitLabel = "Enviar Pedido",
  isSubmitting = false,
}) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section className="tk-panel min-h-[380px]">
      <div className="mb-6 flex items-center justify-between border-b border-solid pb-4">
        <h2 className="flex items-center gap-2 text-[2rem] font-semibold">
          <ShoppingCart className="h-6 w-6 text-[#c81e3a]" />
          {title}
        </h2>
        {totalItems > 0 ? (
          <span className="text-xl text-slate-500">
            {totalItems} {totalItems === 1 ? "item" : "itens"}
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-20 text-center text-slate-400">
          <div className="mb-4 flex justify-center">
            <ShoppingCart className="h-16 w-16 text-slate-300" />
          </div>
          <p className="text-2xl text-slate-500">Carrinho vazio</p>
          <p className="text-xl text-slate-400">
            Adicione produtos para criar um pedido
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5">
            {items.map((item) => (
              <div key={item.id ?? item.name} className="tk-cart-line">
                <div>
                  <p className="text-xl font-semibold">{item.name}</p>
                  <p className="text-lg text-slate-500">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="tk-counter">
                  <button
                    type="button"
                    className="tk-counter-btn"
                    onClick={() => onDecrease?.(item.id)}
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    className="tk-counter-btn"
                    onClick={() => onIncrease?.(item.id)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-2 text-2xl text-red-600"
                    onClick={() => onRemove?.(item.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-2 tk-total-row">
            <span>Subtotal</span>
            <span>{formatPrice(totalValue)}</span>
          </div>
          <div className="mb-5 tk-total-final">
            <span>Total</span>
            <span>{formatPrice(totalValue)}</span>
          </div>

          {showActions ? (
            <div className="space-y-3">
              <button
                type="button"
                className="tk-btn tk-btn-primary w-full py-3 text-xl"
                onClick={onSubmit}
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? "Enviando..." : submitLabel}
              </button>
              <button
                type="button"
                className="tk-btn tk-btn-ghost w-full py-3 text-xl"
                onClick={onClear}
                disabled={items.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Carrinho
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default OrderSummaryPanel;
