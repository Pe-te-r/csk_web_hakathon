import useLocalStorageState from "use-local-storage-state";
import { ProductRequestType } from "../types";

const STORAGE_KEY = "basket";

// Custom hook for managing the basket using localStorage
export function useBasketStorage() {
  // Use localStorage state hook with a default value of an empty array
  const [basket, setBasket] = useLocalStorageState<ProductRequestType[]>(
    STORAGE_KEY,
    { defaultValue: [] }
  );

  // Add to basket
  const addToBasket = (item: ProductRequestType) => {
    setBasket((prev = []) => [...prev, item]);
  };

  // Remove from basket
  const removeFromBasket = (id: string | number) => {
    setBasket((prev = []) => prev.filter((item) => item.id !== id));
  };

  // Clear the entire basket
  const clearBasket = () => {
    setBasket([]);
  };

  // Update basket quantity
  const updateBasket = (id: string, quantity: number) => {
    console.log(quantity)
    setBasket((prev = []) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  return { basket, addToBasket, removeFromBasket, clearBasket, updateBasket };
}