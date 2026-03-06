import ProductCard from "./ProductCard";

function ProductGrid({ products, onAdd }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id ?? product.name}
          product={product}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
