import "../../../styles/UsersOrders.scss";


import React,{ useEffect } from "react";
import { useGetAllUserOrdersQuery } from "../../../api/order";
import { useUser } from "../../../components/context/UserProvider";
import ReactLoading from 'react-loading'

interface Buyer {
  name: string;
  email: string;
}

interface Item {
  product_id: string;
  product: string;
  quantity: number;
  amount: number;
}

interface Order {
  order_id: string;
  buyer: Buyer;
  item: Item;
}

const UserOrders: React.FC = () => {
  const { getUser } = useUser();
  const { data, error, isLoading, isSuccess } = useGetAllUserOrdersQuery({ 
    userId: getUser()?.userId, 
    role: "seller" 
  });

  useEffect(() => {
    if (isSuccess) console.log(data);
    if (error) console.log(error);
  }, [isSuccess, error]);

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

  // Group orders by order_id
  const groupedOrders: Record<string, Order[]> = data?.reduce((acc: Record<string, Order[]>, order: Order) => {
    if (!acc[order.order_id]) {
      acc[order.order_id] = [];
    }
    acc[order.order_id].push(order);
    return acc;
  }, {});

  return (
    <div className="orders-container">
      <h2>User Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {groupedOrders &&
            Object.entries(groupedOrders).map(([orderId, orders]) => (
              <React.Fragment key={orderId}>
                    {orders.map((order, index) => (
                    <>
                  <tr key={order.item.product_id}>
                    {index === 0 && (
                      <td rowSpan={orders.length}>{order.order_id}</td>
                    )}
                    {index === 0 && (
                      <td rowSpan={orders.length}>
                        {order.buyer.name} ({order.buyer.email})
                      </td>
                    )}
                    <td>{order.item.product}</td>
                    <td>{order.item.quantity}</td>
                    <td>${order.item.amount.toFixed(2)}</td>
                            </tr>
                </>
                ))}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrders;
