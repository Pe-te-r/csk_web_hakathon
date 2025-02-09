import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";
import { FaShoppingCart } from "react-icons/fa";
import useLocalStorage from "../hooks/useBasketStorage";
import { BasketItem } from "../types";

const Navbar: React.FC = () => {
  const [basket, setBasket] = useLocalStorage<BasketItem[]>("basket", []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [basketCount, setBasketCount] = useState(0);

  // Keep UI in sync with localStorage
  useEffect(() => {
    if (basket.length > 0) {
      setBasketCount(basket.reduce((total, item) => total + item.quantity, 0));
      
    }
  }, [basket]);

  // Open & Close Modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Update basket quantity
  const updateQuantity = (id: string, newQuantity: number) => {
        if (basket.length > 0) {
          
          const updatedBasket = basket
          .map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
          .filter((item) => item.quantity > 0); // Remove item if quantity is 0
          
          setBasket(updatedBasket);
        }
  };

  // Clear Basket
  const clearCart = () => {
    setBasket([]);
  };

  // Calculate Total Price
  let totalPrice:number
  if (basket.length > 0) {
     totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Left Side: Title */}
          <div className={styles.brand}>
            <Link to="/" className={styles.brandLink}>
              Phantom Market
            </Link>
          </div>

          {/* Right Side: Navigation Links */}
          <div className={styles.links}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/about" className={styles.link}>About Us</Link>
            <Link to="/products" className={styles.link}>Products</Link>
            <Link to="/account" className={styles.link}>Account</Link>
            <Link to="/register" className={styles.registerButton}>Register</Link>

            {/* Basket Icon with Count */}
            <div className={styles.cartIcon} onClick={toggleModal}>
              <FaShoppingCart size={24} />
              {basketCount > 0 && <span className={styles.cartCount}>{basketCount}</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* Basket Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Your Basket</h2>
            {basket.length === 0 ? (
              <p>Your basket is empty.</p>
            ) : (
              <>
                <ul className={styles.cartItems}>
                  {basket.map((item) => (
                    <li key={item.id} className={styles.cartItem}>
                      <span>{item.product || "Unknown Item"} (${item.price.toFixed(2)})</span>
                      <div className={styles.quantityControls}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className={styles.totalPrice}>Total: ${totalPrice.toFixed(2) || ' '}</p>
                <button onClick={() => console.log("Total Price:", totalPrice)} className={styles.buyButton}>Buy</button>
                <button onClick={clearCart} className={styles.clearButton}>Clear Cart</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
