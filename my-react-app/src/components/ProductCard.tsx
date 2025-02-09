import React, { useState, useEffect } from "react";
import styles from "../styles/Product.module.scss";
import { useBasket } from "./context/BasketProvider";

interface ProductRequestType {
  id: string;
  sub_category: string;
  product: string;
  img_path: string;
  price: number;
  description: string;
}

const ProductCard: React.FC<ProductRequestType> = ({
  id,
  sub_category,
  product,
  img_path,
  price,
  description,
}) => {
  const { basket, addToBasket, removeFromBasket } = useBasket();
  const [quantity, setQuantity] = useState<number>(0);

  // Ensure UI updates when basket changes
  useEffect(() => {
    const foundItem = basket.find((item) => item.id === id);
    setQuantity(foundItem ? foundItem.quantity : 0);
  }, [basket, id]); 

  // Function to update basket
  const updateBasket = (newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromBasket(id);
    } else {
      addToBasket({ id, sub_category, product, img_path, price, description, quantity: newQuantity });
    }
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
