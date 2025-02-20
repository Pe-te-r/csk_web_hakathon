import React from "react";
import styles from "../styles/BasketModal.module.scss";
import { useBasketStorage } from "../hooks/useBasketStorage";
import { useUser } from "./context/UserProvider";

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose }) => {
  const { basket, updateBasket, removeFromBasket, clearBasket } = useBasketStorage();
  const {getUser}=useUser()
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
    const items:{product_id:string,quantity:number}[]=[]
    console.log("--- Basket Details ---");
    basket.forEach((item) => {
      console.log(`ID: ${item.id}, Quantity: ${item.quantity}`);
      // const info = {'product_id':item.id,'quantity':item.quantity}
      const info:{product_id:string,quantity:number} ={'product_id':item.id,'quantity':item.quantity}
      items.push(info)
    });
    const data = {
      'user_id': getUser()?.userId,
      'products':items
    }
    console.log(data);
  };

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