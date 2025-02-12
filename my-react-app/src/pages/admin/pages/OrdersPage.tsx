import React, { useState } from "react";
import styles from "../../../styles/OrdersPage.module.scss";

// Define the type for an order
type Order = {
  id: number;
  status: string;
  owner: string;
  seller: string;
  phoneNumber: string;
  email: string;
  username: string;
  productName: string;
  payAmount: number;
  paymentMethod: string;
};

const OrdersPage: React.FC = () => {
  // Static data for orders
  const initialOrders: Order[] = [
    {
      id: 1,
      status: "Completed",
      owner: "John Doe",
      seller: "Tech Store",
      phoneNumber: "+1234567890",
      email: "john.doe@example.com",
      username: "johndoe123",
      productName: "Smartphone",
      payAmount: 599.99,
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      status: "Pending",
      owner: "Jane Smith",
      seller: "Electronics Hub",
      phoneNumber: "+0987654321",
      email: "jane.smith@example.com",
      username: "janesmith456",
      productName: "Laptop",
      payAmount: 1299.99,
      paymentMethod: "PayPal",
    },
    {
      id: 3,
      status: "Shipped",
      owner: "Alice Johnson",
      seller: "Gadget World",
      phoneNumber: "+1122334455",
      email: "alice.johnson@example.com",
      username: "alicej",
      productName: "Headphones",
      payAmount: 199.99,
      paymentMethod: "Credit Card",
    },
  ];

  // State to manage orders
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({});

  // Handle editing an order
  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  // Handle saving an edited order
  const handleSave = (id: number, updatedOrder: Partial<Order>) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, ...updatedOrder } : order
      )
    );
    setEditingId(null);
  };

  // Handle deleting an order
  const handleDelete = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  // Handle adding a new order
  const handleAdd = () => {
    if (
      newOrder.status &&
      newOrder.owner &&
      newOrder.seller &&
      newOrder.phoneNumber &&
      newOrder.email &&
      newOrder.username &&
      newOrder.productName &&
      newOrder.payAmount &&
      newOrder.paymentMethod
    ) {
      const newId = orders.length + 1;
      setOrders([
        ...orders,
        {
          id: newId,
          status: newOrder.status,
          owner: newOrder.owner,
          seller: newOrder.seller,
          phoneNumber: newOrder.phoneNumber,
          email: newOrder.email,
          username: newOrder.username,
          productName: newOrder.productName,
          payAmount: newOrder.payAmount,
          paymentMethod: newOrder.paymentMethod,
        },
      ]);
      setNewOrder({});
    }
  };

  return (
    <div className={styles.ordersPage}>
      <h1>Orders Management</h1>

      {/* Add New Order Section */}
      <div className={styles.addOrder}>
        <input
          type="text"
          placeholder="Status"
          value={newOrder.status || ""}
          onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
        />
        <input
          type="text"
          placeholder="Owner"
          value={newOrder.owner || ""}
          onChange={(e) => setNewOrder({ ...newOrder, owner: e.target.value })}
        />
        <input
          type="text"
          placeholder="Seller"
          value={newOrder.seller || ""}
          onChange={(e) => setNewOrder({ ...newOrder, seller: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={newOrder.phoneNumber || ""}
          onChange={(e) =>
            setNewOrder({ ...newOrder, phoneNumber: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Email"
          value={newOrder.email || ""}
          onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          value={newOrder.username || ""}
          onChange={(e) => setNewOrder({ ...newOrder, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={newOrder.productName || ""}
          onChange={(e) =>
            setNewOrder({ ...newOrder, productName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Pay Amount"
          value={newOrder.payAmount || ""}
          onChange={(e) =>
            setNewOrder({ ...newOrder, payAmount: parseFloat(e.target.value) })
          }
        />
        <input
          type="text"
          placeholder="Payment Method"
          value={newOrder.paymentMethod || ""}
          onChange={(e) =>
            setNewOrder({ ...newOrder, paymentMethod: e.target.value })
          }
        />
        <button onClick={handleAdd}>Add Order</button>
      </div>

      {/* Orders Table */}
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Seller</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Username</th>
            <th>Product Name</th>
            <th>Pay Amount</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {editingId === order.id ? (
                  <select
                    defaultValue={order.status}
                    onChange={(e) =>
                      handleSave(order.id, { status: e.target.value })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td>{order.owner}</td>
              <td>{order.seller}</td>
              <td>{order.phoneNumber}</td>
              <td>{order.email}</td>
              <td>{order.username}</td>
              <td>{order.productName}</td>
              <td>${order.payAmount.toFixed(2)}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <div className={styles.actions}>
                  {editingId === order.id ? (
                    <button
                      className={styles.saveButton}
                      onClick={() => setEditingId(null)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(order.id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;