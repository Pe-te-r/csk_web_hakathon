import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
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
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/about" className={styles.link}>
            About Us
          </Link>
          <Link to="/products" className={styles.link}>
            Products
          </Link>
          <Link to="/account" className={styles.link}>
            Account
          </Link>
          <Link to="/register" className={styles.registerButton}>
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;