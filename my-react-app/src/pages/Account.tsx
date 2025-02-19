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
import ChangePasswordModal from "../components/ChangePasswordModal";
import TwoFAModal from "../components/TwoFAModal";


const Account: React.FC = () => {
const { getUser,deleteUser } = useUser();
const { id: paramId } = useParams<{ id: string }>(); // Get ID from URL

// Use paramId if available, otherwise fallback to logged-in user ID
const id = paramId || getUser()?.userId;

  const { data, isError, isSuccess, error,refetch } = useGetOneUserQuery(id ? { id ,orders:true} : skipToken,{refetchOnFocus:true,refetchOnReconnect:true});
const [updateUser,{isLoading:updateIsLoading,isError:updateIsError,data:updateData,error:updateError,isSuccess:updateIsSuccess}] = useUpdateUserFormMutation()

const userRef = useRef(data); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [user, setUser] = useState<{name?:string,email:string,profilePicture?:File | string,id:string}>({
    id:'',
    name: "",
    email: "",
    profilePicture: "",
  });

  const getImageSrc = () => {
  if (user.profilePicture instanceof File) {
    return URL.createObjectURL(user.profilePicture); 
  }
  return user.profilePicture || "";
};
  const { basket, clearBasket, updateBasket, removeFromBasket } = useBasketStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [orderHistory, setOrderHistory] = useState<ProductRequestType[]>([]);

  const navigate = useNavigate()
  // // Static Order History

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
  };

// Handle Image Upload
const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];

    setUser((prevUser) => ({
      ...prevUser,
      profilePicture: file, // Store the actual File object, not Base64
    }));
  }
};

  // Handle Clearing Cart
  const handleClearCart = () => {
    clearBasket();
  };

  useEffect(() => {
    if (userRef.current?.orders) {
    setOrderHistory(userRef.current.orders)
  }
},[userRef.current])

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
      console.log(data)
      setUser({id:data.id, email:data.email,name:data.username,profilePicture:data?.img_path??'https://i.pinimg.com/236x/e7/1e/2f/e71e2fac8f9d7492cfbc57a0f730adda.jpg'})
      
    }
    if (isError) {
      if ('data' in error) {
        const msg:{message:string} = error.data as {message:string}
        console.log(msg.message)
      }
    }
  },[isSuccess,isError,data])
  useEffect(() => {
    if (updateIsSuccess) {
      toast.success(updateData)
      refetch()
    }
    if (updateIsError) {
      if('data' in updateError)toast.error(updateError?.data as string)
    }
    
  },[updateIsError,updateIsSuccess])
  return (
    <div className={styles.accountContainer}>
      {/* Profile Section */}
      <div className={styles.profileSection}>
        <img src={getImageSrc()} alt="Profile" className={styles.profileImage} />
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
                <button className={styles.editButton} onClick={()=> setIsEditing(!isEditing)}>
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
       <button className={styles.settingsButton} onClick={() => setIsModalOpen(true)}>
      Change Password
    </button>
        {/* <button className={styles.settingsButton}>Enable 2FA</button> */}
        {userRef.current?.fa !== null && userRef.current?.fa?
        <button className={styles.settingsButtonDisable} onClick={() => setIs2FAModalOpen(true)} disabled={true}>Enabled</button>
        :
        <button className={styles.settingsButton} onClick={() => setIs2FAModalOpen(true)}>Enable 2F</button>
        }
        {
          userRef.current?.role === 'seller' ?
          <button className={styles.settingsButton} onClick={()=>navigate('/dashboard')}>Seller Dashboard</button>
           :
        <button className={styles.sellerButton} onClick={()=>navigate('/application')}>Apply Seller</button>
        }
        <button className={styles.dangerButton}>Delete Account</button>
      </div>

      {/* Logout */}
      <button className={styles.logoutButton} onClick={handle_logout}>Logout</button>
          <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TwoFAModal isOpen={is2FAModalOpen} onClose={() => setIs2FAModalOpen(false)} refetch={ refetch} />
    </div>
  );
};

export default Account;
