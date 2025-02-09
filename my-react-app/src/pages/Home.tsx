import React from "react";
import "./HomePage.scss";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Buy & Sell Within Your Campus</h1>
          <p>Find affordable items or become a seller in just a few clicks!</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories">
        <h2>Featured Categories</h2>
        <div className="category-grid">
          <div className="category-card">📚 Books & Stationery</div>
          <div className="category-card">💻 Electronics & Gadgets</div>
          <div className="category-card">👕 Clothing & Accessories</div>
          <div className="category-card">🚲 Bikes & Transport</div>
          <div className="category-card">🏠 Hostel Essentials</div>
        </div>
      </section>

      {/* Trending Items */}
      <section className="trending">
        <h2>Trending Items</h2>
        <div className="trending-grid">
          <div className="trending-item">Item 1</div>
          <div className="trending-item">Item 2</div>
          <div className="trending-item">Item 3</div>
          <div className="trending-item">Item 4</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">1️⃣ Register & Verify</div>
          <div className="step">2️⃣ Browse & Buy</div>
          <div className="step">3️⃣ Apply as Seller</div>
          <div className="step">4️⃣ Sell & Earn</div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <h2>Why Choose Phantom Market?</h2>
        <ul>
          <li>📌 Student-Only Marketplace</li>
          <li>💰 Affordable Deals</li>
          <li>🔒 Secure Transactions</li>
          <li>🚀 Fast & Easy</li>
        </ul>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Students Say</h2>
        <blockquote>
          "I sold my old laptop in 2 days! This platform is a game-changer." – Alex
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Phantom Market. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
