import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Account.module.scss";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useBasketStorage } from "../hooks/useBasketStorage";
import { ProductRequestType } from "../types";
import ReactLoading from 'react-loading'
import { useUser } from "../components/context/UserProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOneUserQuery, useUpdateUserFormMutation } from "../api/users";
import toast from "react-hot-toast";


const Account: React.FC = () => {
const { getUser,deleteUser } = useUser();
const { id: paramId } = useParams<{ id: string }>(); // Get ID from URL

// Use paramId if available, otherwise fallback to logged-in user ID
const id = paramId || getUser()?.userId;

const { data, isError, isSuccess, error } = useGetOneUserQuery(id? id: skipToken,{refetchOnFocus:true,pollingInterval: 7000,refetchOnReconnect:true});
const [updateUser,{isLoading:updateIsLoading,isError:updateIsError,data:updateData,error:updateError,isSuccess:updateIsSuccess}] = useUpdateUserFormMutation()

const userRef = useRef(data); // Store initial user data

  const [user, setUser] = useState<{name?:string,email:string,profilePicture?:string,id:string}>({
    id:'',
    name: "",
    email: "",
    profilePicture: "",
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
        img_path: "",
        description: "Good for music",
        sub_category: "Speakers",
        quantity: 3,
      },
    ]);
  }, []);

  // Handle Profile Edit
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    
    const updatedUserData = {
      "id": user.id,
      "username": user.name,
      "img_path":user.profilePicture
    }
    const oldUserData = {
      'id': userRef.current?.id,
      "username": userRef.current?.username,
      'img_path':userRef.current?.img_path
    }
    if (JSON.stringify(oldUserData) === JSON.stringify(updatedUserData)) {
      console.log("No changes detected, skipping update.");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('id',user.id)
    formDataToSend.append("username", user.name || '');
    formDataToSend.append("img_path", user.profilePicture || '');
      updateUser(formDataToSend)
    console.log(user)
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
    navigate('/')
    setTimeout(deleteUser,100)
  }
  useEffect(() => {
    if (isSuccess) {
      userRef.current = data
      setUser({id:data.id, email:data.email,name:data.username})
    }
    if (isError) {
      if('data' in error)toast.error(error.data as string)
    }
  },[isSuccess,isError])
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success(updateData)
    }
    if (updateIsError) {
      if('data' in updateError)toast.error(updateError?.data as string)
    }
    
  },[updateIsError,updateIsSuccess])
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
              {updateIsLoading ?
                <ReactLoading type="bars" color="#3498db" height={50} width={50} /> :
                <button className={styles.editButton} onClick={handleEditProfile}>
                  Edit Profile
                </button>}
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
