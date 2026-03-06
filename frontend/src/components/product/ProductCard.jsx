import { Plus } from "lucide-react";

function getStatusMeta(status) {
  if (status === "low") {
    return {
      label: "Estoque Baixo",
      badgeClass: "tk-badge tk-badge-low",
      disabled: true,
    };
  }

  if (status === "unavailable") {
    return {
      label: "Indisponível",
      badgeClass: "tk-badge tk-badge-unavailable",
      disabled: true,
    };
  }

  return {
    label: "Disponível",
    badgeClass: "tk-badge tk-badge-available",
    disabled: false,
  };
}

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function ProductCard({ product, onAdd }) {
  const status = getStatusMeta(product.status);
  const isDisabled = status.disabled || typeof onAdd !== "function";

  return (
    <article className="tk-card">
      <div className="mb-2 flex min-w-0 items-start justify-between gap-2 md:gap-3">
        <h3 className="min-w-0 break-words text-[1.7rem] font-semibold leading-tight md:text-[2rem]">
          {product.name}
        </h3>
        <span className={`${status.badgeClass} shrink-0 whitespace-nowrap`}>
          {status.label}
        </span>
      </div>

      <p className="tk-card-description">{product.description}</p>
      <p className="mb-4 text-base text-slate-500">
        Receita: {product.recipeSummary || "Sem ficha técnica cadastrada"}
      </p>

      <div className="flex items-center justify-between gap-2">
        <span className="tk-price">{formatPrice(product.price)}</span>
        <button
          type="button"
          className="tk-btn tk-btn-primary px-3 py-2 text-sm md:text-base"
          disabled={isDisabled}
          onClick={() => onAdd?.(product)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Adicionar
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
