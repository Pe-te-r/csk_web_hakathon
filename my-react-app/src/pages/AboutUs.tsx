import React from "react";
import styles from "../styles/AboutUs.module.scss";

const AboutUs: React.FC = () => {
  return (
    <div className={styles.aboutUsContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1>Welcome to Phantom Market</h1>
        <p>The ultimate student marketplace where you can buy and sell within your campus community.</p>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <h2>Our Mission</h2>
        <p>
          We aim to create a **trusted** and **secure** platform for students to trade essential items easily. 
          Whether you're looking for **affordable gadgets, textbooks, or fashion**, Phantom Market is here for you!
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyChooseSection}>
        <h2>Why Choose Phantom Market?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Student-Focused</h3>
            <p>Designed specifically for university students, ensuring a **safe** and **reliable** environment.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Secure Transactions</h3>
            <p>We prioritize security, making sure all transactions are transparent and fraud-free.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Affordable Prices</h3>
            <p>Buy and sell at **reasonable prices**, making it easier to save money on essentials.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <h2>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <span>1️⃣</span> Register on Phantom Market
          </div>
          <div className={styles.step}>
            <span>2️⃣</span> Browse & Buy Items
          </div>
          <div className={styles.step}>
            <span>3️⃣</span> Apply for Seller Status
          </div>
          <div className={styles.step}>
            <span>4️⃣</span> Upload & Sell Your Items
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <h2>Contact Us</h2>
        <p>Have questions? Reach out to us via email or social media.</p>
        <div className={styles.socialLinks}>
          <a href="#">📧 Email Us</a>
          <a href="#">📱 WhatsApp</a>
          <a href="#">📘 Facebook</a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
