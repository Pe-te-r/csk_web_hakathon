import { createContext, useContext, ReactNode } from "react";
import { useBasketStorage } from "../../hooks/useBasketStorage";
import { ProductRequestType } from "../../types";

// Define the shape of the context
interface BasketContextType {
  basket: ProductRequestType[];
  addToBasket: (item: ProductRequestType) => void;
  removeFromBasket: (id: string | number) => void;
  clearBasket: () => void;
  updateBasket: (id: string, quantity: number) => void;
}

// Create the context
const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Create the provider component
export function BasketProvider({ children }: { children: ReactNode }) {
  const { basket, addToBasket, removeFromBasket, clearBasket, updateBasket } =
    useBasketStorage();

  return (
    <BasketContext.Provider
      value={{ basket, addToBasket, removeFromBasket, clearBasket, updateBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
}

// Custom hook to use the basket context
export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
}
