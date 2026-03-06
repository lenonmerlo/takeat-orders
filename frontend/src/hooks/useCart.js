import { useMemo, useState } from "react";

export function useCart() {
  const [items, setItems] = useState([]);

  const addProduct = (product) => {
    setItems((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price ?? 0),
          quantity: 1,
        },
      ];
    });
  };

  const increase = (itemId) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrease = (itemId) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const remove = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  const clear = () => {
    setItems([]);
  };

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    items,
    total,
    addProduct,
    increase,
    decrease,
    remove,
    clear,
    setItems,
  };
}
