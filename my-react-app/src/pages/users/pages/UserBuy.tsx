import React from 'react';
import styles from '../../../styles/UserBuy.module.scss'

interface Product {
  product_id: string;
  product: string;
  quantity: number;
  price: number;
}

interface UserBuyProps {
  data: {
    user_id: string;
    products: Product[];
  };
}

const UserBuy: React.FC<UserBuyProps> = ({ data }) => {
  const totalPrice = data.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleBuy = () => {
    // Implement the buy logic here
    console.log("Buying products:", data);
  };

  return (
    <div className={styles.userBuyContainer}>
      <h2>Buy Products</h2>
      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((item) => (
            <tr key={item.product_id}>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td>${totalPrice.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <button onClick={handleBuy} className={styles.buyButton}>Buy</button>
    </div>
  );
};

export default UserBuy;