import React, { useState, useEffect } from "react";
import styles from "../styles/Account.module.scss";
import { useBasketStorage } from "../hooks/useBasketStorage";
import { ProductRequestType } from "../types";
import { useUser } from "../components/context/UserProvider";
import { useNavigate } from "react-router-dom";

const Account: React.FC = () => {
  const {deleteUser}=useUser()
  // Static user profile
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePicture: "https://via.placeholder.com/100",
  });

  const { basket, clearBasket, updateBasket, removeFromBasket } = useBasketStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [orderHistory, setOrderHistory] = useState<ProductRequestType[]>([]);

  const navigate = useNavigate()
  // Static Order History
  useEffect(() => {
    setOrderHistory([
      {
        id: "ORD12345",
        product: "Wireless Headphones",
        price: 49.99,
        img_path: "https://via.placeholder.com/100",
        description: "Good for music",
        sub_category: "Speakers",
        quantity: 3,
      },
    ]);
  }, []);

  // Handle Profile Edit
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  // Handle Image Upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
  setUser((prevUser) => ({
    ...prevUser,
    profilePicture: e.target!.result as string, // Assert that target is not null
  }));
};
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Handle Clearing Cart
  const handleClearCart = () => {
    clearBasket();
  };

  // Handle Clearing Order History
  const handleClearHistory = () => {
    setOrderHistory([]);
  };

  // Handle Quantity Change
  const updateQuantity = (id: string, change: number) => {
    if (change === 0) {
      removeFromBasket(id);
    }
    updateBasket(id, change);
  };

  const handle_logout = () => {
    deleteUser()
    navigate('/')
  }
  return (
    <div className={styles.accountContainer}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <img src={user.profilePicture} alt="Profile" className={styles.profileImage} />
        {isEditing ? (
          <div>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button className={styles.saveButton} onClick={handleEditProfile}>
              Save
            </button>
          </div>
        ) : (
          <>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <button className={styles.editButton} onClick={handleEditProfile}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Cart Items */}
      <div className={styles.section}>
        <h3>Cart Items</h3>
        {basket.length > 0 ? (
          <>
            <div className={styles.horizontalScroll}>
              {basket.map((item, index) => (
                <div key={index} className={styles.itemCard}>
                  <img src={item.img_path} alt={item.product} className={styles.itemImage} />
                  <p>{item.product}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.clearButton} onClick={handleClearCart}>
              Clear Cart
            </button>
          </>
        ) : (
          <p>No items in cart</p>
        )}
      </div>

      {/* Order History */}
      <div className={styles.section}>
        <h3>Order History</h3>
        {orderHistory.length > 0 ? (
          <>
            <div className={styles.horizontalScroll}>
              {orderHistory.map((order) => (
                <div key={order.id} className={styles.itemCard}>
                  <img src={order.img_path} alt={order.product} className={styles.itemImage} />
                  <p>{order.product}</p>
                  <p>${order.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <button className={styles.clearButton} onClick={handleClearHistory}>
              Clear History
            </button>
          </>
        ) : (
          <p>No order history available</p>
        )}
      </div>

      {/* Account Settings */}
      <div className={styles.accountSettings}>
        <button className={styles.settingsButton}>Change Password</button>
        <button className={styles.settingsButton}>Enable 2FA</button>
        <button className={styles.dangerButton}>Delete Account</button>
      </div>

      {/* Logout */}
      <button className={styles.logoutButton} onClick={handle_logout}>Logout</button>
    </div>
  );
};

export default Account;
