import React from "react";
import styles from "../styles/OrderHistory.module.scss";

interface Product {
  product_id: string;
  img_url?: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total_amount: number;
  products: Product[];
}

interface OrderHistoryProps {
  orderHistory: Order[];
  handleClearHistory: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orderHistory, handleClearHistory }) => {
  return (
    <div className={styles.section}>
      <h3>Order History</h3>
      {orderHistory.length > 0 ? (
        <div className={styles.ordersContainer}>
          {orderHistory.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              {/* Order Total & ID */}
              <div className={styles.orderHeader}>
                <h4>Order ID: {order.id}</h4>
                <h4>Total: ${order.total_amount}</h4>
              </div>

              {/* Products Scrollable on X-Axis */}
              <div className={styles.productsContainer}>
                {order.products.map((product) => (
                  <div key={product.product_id} className={styles.productCard}>
                    <img
                      src={product.img_url || "https://via.placeholder.com/100"}
                      alt={product.product_name || "N/A"}
                      className={styles.productImage}
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/100")}
                    />
                    <p>{product.product_name || "N/A"}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Amount: ${product.quantity * product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No order history available</p>
      )}

      {/* Clear History Button */}
      <button className={styles.clearButton} onClick={handleClearHistory}>
        Clear History
      </button>
    </div>
  );
};

export default OrderHistory;
