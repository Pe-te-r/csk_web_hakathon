import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../styles/SellerPageApplication.module.scss'; // Import SCSS module
import { useUpdateUserFormMutation } from '../../../api/users';
import toast from 'react-hot-toast';
import { useUser } from '../../../components/context/UserProvider';

const SellerPageApplication: React.FC = () => {
  // Static data for the seller application page
  const platformBenefits = [
    "Trade securely with fellow students in your university.",
    "Build trust through verified profiles and transactions.",
    "Enable 2FA for enhanced account security.",
    "Choose your preferred payment method for seamless transactions.",
    "Join a community focused on fair and safe trading.",
  ];

  const securityTips = [
    "Always enable Two-Factor Authentication (2FA) for your account.",
    "Verify the identity of the buyer/seller before trading.",
    "Use the platform's messaging system for communication.",
    "Report any suspicious activity to the Phantom Market support team.",
  ];
  const { getUser } = useUser()
  const userIdRef = useRef( getUser()?.userId || "");
  const [updateUser,{isLoading:updateIsLoading,isError:updateIsError,data:updateData,error:updateError,isSuccess:updateIsSuccess}] = useUpdateUserFormMutation()

  const [details,setDetails]=useState<{id:string,phone:string,business_name:string,role:string}>({id:userIdRef.current,business_name:'',phone:'',role:'seller'})

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setDetails(prev => ({ ...prev, [name]: value }));
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
     const formDataToSend = new FormData();
    formDataToSend.append('id',details.id)
    formDataToSend.append("phone", details.phone || '');
    formDataToSend.append("role", details.role || 'user');
    formDataToSend.append("business_name", details.business_name || '');
    console.log(details)
    updateUser(formDataToSend)
  }

    useEffect(() => {
    if (updateIsSuccess) {
      toast.success(updateData)
    }
    if (updateIsError) {
      if('data' in updateError)toast.error(updateError?.data as string)
    }
    
  },[updateIsError,updateIsSuccess])

  return (
    <div className={styles.sellerPage}>
      <h1 className={styles.title}>Become a Seller on Phantom Market</h1>
      <p className={styles.subtitle}>
        Join our trusted community of students and start trading commodities securely with your peers.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Phantom Market?</h2>
        <ul className={styles.list}>
          {platformBenefits.map((benefit, index) => (
            <li key={index} className={styles.listItem}>{benefit}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Security Tips for Sellers</h2>
        <ul className={styles.list}>
          {securityTips.map((tip, index) => (
            <li key={index} className={styles.listItem}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Seller Application Form</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name='phone'
              className={styles.input}
              placeholder="Enter your phone number"
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="businessName" className={styles.label}>Business Name (Optional)</label>
            <input
              type="text"
              name='business_name'
              id="businessName"
              className={styles.input}
              onChange={handleChange}
              placeholder="Enter your business name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Enable Two-Factor Authentication (2FA)</label>
            <p className={styles.description}>
              To ensure the security of your account, please enable 2FA if you haven't already.{" "}
              <a href="/enable-2fa" className={styles.link}>Enable 2FA Now</a>
            </p>
          </div>


          <button type="submit" className={styles.submitButton}>Submit Application</button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Building Trust Among Students</h2>
        <p className={styles.description}>
          Phantom Market is designed to foster a safe and trustworthy environment for students to trade commodities. 
          By verifying your identity, enabling 2FA, and following our security guidelines, you contribute to a secure 
          community where everyone can trade with confidence.
        </p>
      </div>
    </div>
  );
};

export default SellerPageApplication;