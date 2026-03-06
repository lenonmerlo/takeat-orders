import { useEffect, useState } from "react";
import OrderSummaryPanel from "../components/cart/OrderSummaryPanel";
import ProductCard from "../components/product/ProductCard";
import DemoControlsPanel from "../components/shared/DemoControlsPanel";
import SearchBar from "../components/shared/SearchBar";
import { listProducts } from "../services/productsService";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    listProducts().then(setProducts);
  }, []);

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
      <div>
        <SearchBar />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id ?? product.name} product={product} />
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <OrderSummaryPanel items={[]} />
        <DemoControlsPanel />
      </aside>
    </section>
  );
}

export default ProductsPage;
