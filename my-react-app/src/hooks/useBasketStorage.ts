import { useState, useEffect } from "react";
// import { ProductRequestType } from "../types";
export interface ProductRequestType {
  id:string
  product: string;
  sub_category: string;
  price: number;
  description: string;
  img_path: string;
  quantity:number
}

const BASKET_STORAGE_KEY = "basket";

export function useBasketStorage() {
  // Initialize state from localStorage
  const [basket, setBasket] = useState<ProductRequestType[]>(() => {
    try {
      const storedBasket = localStorage.getItem(BASKET_STORAGE_KEY);
      return storedBasket ? (Array.isArray(JSON.parse(storedBasket)) ? JSON.parse(storedBasket) : []) : [];
    } catch (error) {
      console.error("Error loading basket from localStorage", error);
      return [];
    }
  });

  // Synchronize state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
    } catch (error) {
      console.error("Error saving basket to localStorage", error);
    }
  }, [basket]);

  // Add an item to the basket
  const addToBasket = (item: ProductRequestType) => {
    setBasket((prevBasket) => [...prevBasket, item]);
  };

  // Remove an item from the basket by id
  const removeFromBasket = (id: string | number) => {
    setBasket((prevBasket) => prevBasket.filter((item) => item.id !== id));
  };

  // update item
    const updateBasket = (id:string ,quantity:number) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((b) => b.id === id);

      if (existingItem) {
        return prevBasket.map((b) =>
          b.id === id ? { ...b, quantity: quantity } : b
        );
      } else {
        return [...prevBasket];
      }
    });
  };

  // Clear the entire basket
  const clearBasket = () => {
    setBasket([]);
  };

  return { basket, addToBasket, removeFromBasket, clearBasket,updateBasket };
}