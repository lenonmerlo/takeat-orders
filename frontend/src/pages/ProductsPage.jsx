import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import OrderSummaryPanel from "../components/cart/OrderSummaryPanel";
import ProductGrid from "../components/product/ProductGrid";
import OrderErrorModal from "../components/shared/OrderErrorModal";
import SearchBar from "../components/shared/SearchBar";
import { useCart } from "../hooks/useCart";
import {
  formatInsufficientStockMessage,
  useCreateOrder,
} from "../hooks/useCreateOrder";
import { useProducts } from "../hooks/useProducts";

function ProductsPage() {
  const {
    products,
    query,
    setQuery,
    filteredProducts,
    isLoading,
    errorMessage,
  } = useProducts();
  const cart = useCart();
  const orderCreation = useCreateOrder();
  const cartPanelRef = useRef(null);

  const productsById = useMemo(
    () =>
      new Map(
        products
          .filter((product) => Number.isInteger(Number(product.id)))
          .map((product) => [Number(product.id), product]),
      ),
    [products],
  );

  const getInsufficientInputs = (nextItems) => {
    const consumptionByInput = new Map();

    for (const cartItem of nextItems) {
      const product = productsById.get(Number(cartItem.id));
      if (!product) continue;

      const inputs = Array.isArray(product.inputs) ? product.inputs : [];

      for (const input of inputs) {
        const inputId = Number(input?.id);
        const qtyRequired = Number(
          input?.ProductInput?.qtyRequired ?? input?.qtyRequired ?? 0,
        );
        const stockQty = Number(input?.stockQty ?? 0);

        if (!Number.isInteger(inputId) || qtyRequired <= 0) continue;

        const available =
          Number.isFinite(stockQty) && stockQty > 0 ? stockQty : 0;
        const required = qtyRequired * Number(cartItem.quantity ?? 0);

        const current = consumptionByInput.get(inputId) || {
          inputId,
          name: input?.name || `Insumo #${inputId}`,
          unit: input?.unit || "un",
          required: 0,
          available,
        };

        current.required += required;
        current.available = Math.min(current.available, available);

        consumptionByInput.set(inputId, current);
      }
    }

    return [...consumptionByInput.values()].filter(
      (item) => item.required > item.available,
    );
  };

  const handleInsufficient = (insufficientInputs) => {
    orderCreation.setResultMessage("");
    orderCreation.setErrorMessage(
      formatInsufficientStockMessage(insufficientInputs),
    );
  };

  const handleAddProduct = (product) => {
    const exists = cart.items.find((item) => item.id === product.id);
    const nextItems = exists
      ? cart.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [
          ...cart.items,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price ?? 0),
            quantity: 1,
          },
        ];

    const insufficientInputs = getInsufficientInputs(nextItems);
    if (insufficientInputs.length > 0) {
      handleInsufficient(insufficientInputs);
      return;
    }

    cart.addProduct(product);
  };

  const handleIncreaseItem = (itemId) => {
    const nextItems = cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
    );

    const insufficientInputs = getInsufficientInputs(nextItems);
    if (insufficientInputs.length > 0) {
      handleInsufficient(insufficientInputs);
      return;
    }

    cart.increase(itemId);
  };

  const handleSubmitOrder = async () => {
    const order = await orderCreation.submitOrder(cart.items);
    if (order) {
      cart.clear();
    }
  };

  const handleCloseOrderError = () => {
    orderCreation.setErrorMessage("");
  };

  const handleAdjustOrder = () => {
    orderCreation.setErrorMessage("");

    cartPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    cartPanelRef.current?.focus();
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div>
          <SearchBar value={query} onChange={setQuery} />

          <div className="mb-4 flex items-center justify-between">
            <h2 className="tk-section-title mb-0">Produtos</h2>
            <Link to="/orders" className="tk-btn tk-btn-ghost">
              Ver pedidos
            </Link>
          </div>

          {errorMessage ? (
            <div className="tk-alert tk-alert-danger mb-5">
              <p className="text-xl font-semibold">{errorMessage}</p>
            </div>
          ) : null}

          {orderCreation.resultMessage ? (
            <div className="mb-5 rounded-xl border border-solid border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
              <p className="text-xl font-semibold">
                {orderCreation.resultMessage}
              </p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="tk-panel text-center">
              <p className="text-xl text-slate-500">Carregando produtos...</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} onAdd={handleAddProduct} />
          )}

          {!isLoading && filteredProducts.length === 0 ? (
            <div className="tk-panel mt-4 text-center">
              <p className="text-xl text-slate-500">
                Nenhum produto encontrado.
              </p>
            </div>
          ) : null}
        </div>

        <aside
          ref={cartPanelRef}
          tabIndex={-1}
          className="self-start xl:sticky xl:top-6"
        >
          <OrderSummaryPanel
            items={cart.items}
            onIncrease={handleIncreaseItem}
            onDecrease={cart.decrease}
            onRemove={cart.remove}
            onSubmit={handleSubmitOrder}
            onClear={cart.clear}
            isSubmitting={orderCreation.isSubmitting}
          />
        </aside>
      </section>

      <OrderErrorModal
        isOpen={Boolean(orderCreation.errorMessage)}
        message={orderCreation.errorMessage}
        onClose={handleCloseOrderError}
        onAdjust={handleAdjustOrder}
      />
    </>
  );
}

export default ProductsPage;
