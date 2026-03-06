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

function ProductCard({ product }) {
  const status = getStatusMeta(product.status);

  return (
    <article className="tk-card">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-[1.9rem] font-semibold leading-tight">
          {product.name}
        </h3>
        <span className={status.badgeClass}>{status.label}</span>
      </div>

      <p className="tk-card-description">{product.description}</p>

      <div className="flex items-center justify-between">
        <span className="tk-price">{formatPrice(product.price)}</span>
        <button
          type="button"
          className="tk-btn tk-btn-primary"
          disabled={status.disabled}
        >
          ＋ Adicionar
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
