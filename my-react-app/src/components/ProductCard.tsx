import React, { useState, useEffect } from "react";
import styles from "../styles/Product.module.scss";
import useLocalStorage from "../hooks/useBasketStorage";

interface ProductProps {
  id: string;
  sub_category: string;
  product: string;
  img_path: string;
  price: number;
  description: string;
}

interface BasketItem {
  id: string;
  quantity: number;
  price: number;
}

const ProductCard: React.FC<ProductProps> = ({
  id,
  sub_category,
  product,
  img_path,
  price,
  description,
}) => {
  const [basket, setBasket] = useLocalStorage<BasketItem[]>("basket", []);
  const [quantity, setQuantity] = useState<number>(0);

  // Load quantity from localStorage on mount
  useEffect(() => {
    if ( basket.length > 0){
      const foundItem = basket.find((item) => item.id === id);
        if (foundItem) {
          setQuantity(foundItem.quantity);
        }
    }
  }, [basket, id]); // Re-run when basket changes

  // Function to update basket
  const updateBasket = (newQuantity: number) => {
    let updatedBasket: BasketItem[];

    if (newQuantity === 0) {
      // Remove item if quantity is 0
      updatedBasket = basket.filter((item) => item.id !== id);
    } else {
      if ( basket.length> 0) {
        const existingItem = basket.find((item) => item.id === id);
        if (existingItem) {
          updatedBasket = basket.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          );
        } else {
          updatedBasket = [...basket, { id, quantity: newQuantity, price }];
        }
        setBasket(updatedBasket);
      }
    }

    setQuantity(newQuantity); // Update UI state
  };

  return (
    <div className={styles.productCard}>
      <img src={img_path} alt={product} className={styles.productImage} />
      <div className={styles.productInfo}>
        <h3>{product}</h3>
        <p className={styles.category}>{sub_category}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.bottom}>
          <span className={styles.price}>${price.toFixed(2)}</span>
          {quantity > 0 ? (
            <div className={styles.quantityControls}>
              <button className={styles.subtractbtn} onClick={() => updateBasket(quantity - 1)}>-</button>
              <span className={styles.quantity}>{quantity}</span>
              <button className={styles.addBtn} onClick={() => updateBasket(quantity + 1)}>+</button>
            </div>
          ) : (
            <button onClick={() => updateBasket(1)} className={styles.buyBtn}>
              Add to Basket
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
