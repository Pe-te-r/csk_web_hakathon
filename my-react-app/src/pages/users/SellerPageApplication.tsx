import React from 'react';
import styles from '../../styles/SellerPageApplication.module.scss'; // Import SCSS module

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
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone Number *</label>
            <input
              type="tel"
              id="phone"
              className={styles.input}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="businessName" className={styles.label}>Business Name (Optional)</label>
            <input
              type="text"
              id="businessName"
              className={styles.input}
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

          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod" className={styles.label}>Preferred Payment Method *</label>
            <select id="paymentMethod" className={styles.input} required>
              <option value="">Select a payment method</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
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