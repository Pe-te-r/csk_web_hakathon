import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";
import { FaShoppingCart } from "react-icons/fa";
import { useBasketStorage } from "../hooks/useBasketStorage";
import BasketModal from "./BasketModal";

const Navbar: React.FC = () => {
  const { basket } = useBasketStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [basketCount, setBasketCount] = useState(0);

  useEffect(() => {
    setBasketCount(basket.reduce((total, item) => total + item.quantity, 0));
  }, [basket]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <Link to="/" className={styles.brandLink}>
              Phantom Market
            </Link>
          </div>
          <div className={styles.links}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/about" className={styles.link}>About Us</Link>
            <Link to="/products" className={styles.link}>Products</Link>
            <Link to="/account" className={styles.link}>Account</Link>
            <Link to="/register" className={styles.registerButton}>Register</Link>
            <div className={styles.cartIcon} onClick={() => setIsModalOpen(true)}>
              <FaShoppingCart size={24} />
              {basketCount > 0 && <span className={styles.cartCount}>{basketCount}</span>}
            </div>
          </div>
        </div>
      </nav>

      <BasketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
