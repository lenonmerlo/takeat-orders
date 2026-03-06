import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../services/productsService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await listProducts({ page: 1, limit: 50 });
        setProducts(response);
      } catch (error) {
        setProducts([]);
        setErrorMessage(
          error?.message || "Não foi possível carregar os produtos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return products;

    return products.filter((product) => {
      const name = product.name?.toLowerCase() ?? "";
      const description = product.description?.toLowerCase() ?? "";
      const recipeSummary = product.recipeSummary?.toLowerCase() ?? "";

      return (
        name.includes(value) ||
        description.includes(value) ||
        recipeSummary.includes(value)
      );
    });
  }, [products, query]);

  return {
    products,
    query,
    setQuery,
    filteredProducts,
    isLoading,
    errorMessage,
  };
}
