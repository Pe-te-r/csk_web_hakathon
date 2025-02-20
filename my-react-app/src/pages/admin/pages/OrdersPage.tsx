import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import "../../../styles/OrdersPage.module.scss"; 
import { useGetAllOrdersQuery } from "../../../api/order";

// Define Types
interface Buyer {
  name: string;
  email: string;
  phone: string | null;
}

interface Seller {
  name: string;
  email: string;
  phone: string;
}

interface Product {
  product: string;
  quantity: number;
  amount: number;
}

interface Order {
  order_id: string;
  total: number;
  buyer: Buyer;
  product: {
    seller: Seller;
    product: Product;
  }[];
}

const AdminOrdersTable: React.FC = () => {
  const { data, error, isLoading, isSuccess } = useGetAllOrdersQuery(undefined,{pollingInterval:15000,refetchOnFocus:true,refetchOnReconnect:true});
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isSuccess && data) {
      setOrders(data);
    }
    if (error) {
      console.error(error);
    }
  }, [isSuccess, error, data]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <ReactLoading color="#3498db" />
      </div>
    );
  }

  if (error) {
    return <div className="error">Failed to load orders</div>;
  }

  return (
    <div className="orders-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>index</th>
            <th>Buyer Name</th>
            <th>Buyer Email</th>
            <th>Buyer Phone</th>
            <th>Seller Name</th>
            <th>Seller Email</th>
            <th>Seller Phone</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            {/* <th>Total</th> */}
          </tr>
        </thead>
        <tbody>
  {orders.map((order, index) => (
    <React.Fragment key={order.order_id}>
      {/* Order Header Row with a Bold Bottom Border */}
      <tr className="order-header">
        <td>{index + 1}</td>
        <td>{order.buyer.name}</td>
        <td>{order.buyer.email}</td>
        <td>{order.buyer.phone ?? "N/A"}</td>
        <td colSpan={6} className="total-amount">
          Total: Ksh {order.total.toLocaleString()}
        </td>
      </tr>

      {/* Order Product Rows */}
      {order.product.map((item, idx) => (
        <tr key={idx}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>{item.seller.name}</td>
          <td>{item.seller.email}</td>
          <td>{item.seller.phone}</td>
          <td>{item.product.product}</td>
          <td>{item.product.quantity}</td>
          <td>Ksh {item.product.amount.toLocaleString()}</td>
        </tr>
      ))}
    </React.Fragment>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default AdminOrdersTable;
