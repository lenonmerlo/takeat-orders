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
        <h2 className="flex items-center gap-2 text-[1.5rem] font-semibold md:text-[2rem]">
          <ShoppingCart className="h-6 w-6 text-[#c81e3a]" />
          {title}
        </h2>
        {totalItems > 0 ? (
          <span className="text-base text-slate-500 md:text-xl">
            {totalItems} {totalItems === 1 ? "item" : "itens"}
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-14 text-center text-slate-400 md:mt-20">
          <div className="mb-4 flex justify-center">
            <ShoppingCart className="h-16 w-16 text-slate-300" />
          </div>
          <p className="text-xl text-slate-500 md:text-2xl">Carrinho vazio</p>
          <p className="text-base text-slate-400 md:text-xl">
            Adicione produtos para criar um pedido
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5">
            {items.map((item) => (
              <div key={item.id ?? item.name} className="tk-cart-line gap-2">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold md:text-xl">{item.name}</p>
                  <p className="text-base text-slate-500 md:text-lg">
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
                  <span className="text-lg font-semibold md:text-xl">{item.quantity}</span>
                  <button
                    type="button"
                    className="tk-counter-btn"
                    onClick={() => onIncrease?.(item.id)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-1 text-xl text-red-600 md:ml-2 md:text-2xl"
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
                className="tk-btn tk-btn-primary w-full py-3 text-base md:text-xl"
                onClick={onSubmit}
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? "Enviando..." : submitLabel}
              </button>
              <button
                type="button"
                className="tk-btn tk-btn-ghost w-full py-3 text-base md:text-xl"
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
