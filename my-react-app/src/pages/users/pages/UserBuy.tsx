import React, { useEffect, useRef } from 'react';
import styles from '../../../styles/UserBuy.module.scss';
import { useSendOrderMutation } from '../../../api/order';
import { useBasketStorage } from '../../../hooks/useBasketStorage';

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
  onClose: () => void;
}

const UserBuy: React.FC<UserBuyProps> = ({ data, onClose }) => {
  const totalPrice = data.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [createOrder, { isSuccess, error, isError, data: orderData }] = useSendOrderMutation();
  const { clearBasket } = useBasketStorage();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBuy = () => {
    const user_id = data.user_id;
    const products = data.products.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    createOrder({ user_id, products });
    console.log("Buying products:", data);
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(orderData);
      clearBasket();
      onClose();
    }
    if (isError) {
      console.log(error);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  return (
    <div className={styles.userBuyContainer} ref={modalRef}>
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
      <button onClick={onClose} className={styles.hideButton}>Hide</button>
    </div>
  );
};

export default UserBuy;