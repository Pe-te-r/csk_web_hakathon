import React, { useState } from 'react';
import styles from "../styles/BasketModal.module.scss";
import { useBasketStorage } from "../hooks/useBasketStorage";
import { useUser } from "./context/UserProvider";
import UserBuy from '../pages/users/pages/UserBuy';

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductOrderDetails {
  product_id: string;
  price: number;
  quantity: number;
  product: string;
}

interface ProductOrderRequest {
  user_id: string;
  products: ProductOrderDetails[];
}

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose }) => {
  const { basket, updateBasket, removeFromBasket, clearBasket } = useBasketStorage();
  const { getUser } = useUser();
  const [showBuyPage, setShowBuyPage] = useState(false);
  const [buyData, setBuyData] = useState<ProductOrderRequest>({ user_id: "", products: [] });

  if (!isOpen) return null;
  const totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromBasket(id);
    } else {
      updateBasket(id as string, newQuantity);
    }
  };

  const printDetails = () => {
    console.clear();
    const items: { product_id: string, quantity: number, product: string, price: number }[] = [];
    console.log("--- Basket Details ---");

    if (!basket || basket.length === 0) {
      console.error("Basket is empty or not defined");
      return;
    }

    basket.forEach((item) => {
      console.log(`ID: ${item.id}, Quantity: ${item.quantity}`);
      const info = { product_id: item.id, quantity: item.quantity, product: item.product, price: item.price };
      items.push(info);
    });

    const userId = getUser()?.userId;
    if (!userId) {
      console.error("User ID is not defined");
      return;
    }

    const data = {
      user_id: userId,
      products: items
    };

    console.log(data);
    setBuyData(data);
    setShowBuyPage(true);
  };

  if (showBuyPage && buyData) {
    return <UserBuy data={buyData} onClose={() => setShowBuyPage(false)} />;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Your Basket</h2>
        {basket.length === 0 ? (
          <p>Your basket is empty.</p>
        ) : (
          <>
            <div className={styles.cartGrid}>
              {basket.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img src={item.img_path} alt={item.product} className={styles.cartImage} />
                  <div className={styles.itemDetails}>
                    <h4>{item.product}</h4>
                    <p>Category: {item.sub_category}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <div className={styles.quantityControls}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</p>
            <div className={styles.buttonContainer}>
              <button onClick={clearBasket} className={styles.clearButton}>Clear Cart</button>
              <button onClick={printDetails} className={styles.buyButton}>Buy</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BasketModal;