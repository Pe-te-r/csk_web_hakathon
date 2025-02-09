import styles from '../styles/Home.module.scss'
const HomePage = () => {
    return (
        <div className={styles['home-container']}>
      {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles["hero-content"]}>
          <h1>Welcome to Phantom Market</h1>
          <p>Buy & sell easily within your campus. Find great deals or become a seller today!</p>
                    <button className={styles["cta-button"]}>Get Started</button>
        </div>
      </section>

      {/* Featured Categories */}
            <section className={styles.categories}>
        <h2>Shop by Categories</h2>
                <div className={styles["category-grid"]}>
                    <div className={styles["category-card"]}>
            <img src="https://source.unsplash.com/200x200/?books" alt="Books" />
            <p>Books & Stationery</p>
          </div>
                    <div className={styles["category-card"]}>
            <img src="https://source.unsplash.com/200x200/?electronics" alt="Electronics" />
            <p>Electronics & Gadgets</p>
          </div>
                    <div className={styles["category-card"]}>
            <img src="https://source.unsplash.com/200x200/?fashion" alt="Fashion" />
            <p>Clothing & Accessories</p>
          </div>
                    <div className={styles["category-card"]}>
            <img src="https://source.unsplash.com/200x200/?transport" alt="Transport" />
            <p>Bikes & Transport</p>
          </div>
                    <div className={styles["category-card"]}>
            <img src="https://source.unsplash.com/200x200/?room" alt="Hostel Essentials" />
            <p>Hostel Essentials</p>
          </div>
        </div>
      </section>

      {/* Trending Items */}
      <section className="trending">
        <h2>Trending Items</h2>
        <div className="trending-grid">
          <div className="trending-item">
            <img src="https://source.unsplash.com/200x200/?headphones" alt="Headphones" />
            <p>Wireless Headphones - $49.99</p>
          </div>
          <div className="trending-item">
            <img src="https://source.unsplash.com/200x200/?laptop" alt="Laptop" />
            <p>Used Laptop - $299.99</p>
          </div>
          <div className="trending-item">
            <img src="https://source.unsplash.com/200x200/?shoes" alt="Shoes" />
            <p>Running Shoes - $39.99</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">1️⃣ Register & Verify</div>
          <div className="step">2️⃣ Browse & Buy</div>
          <div className="step">3️⃣ Apply to Sell</div>
          <div className="step">4️⃣ List & Sell Items</div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <h2>Why Choose Phantom Market?</h2>
        <ul>
          <li>📌 Student-Only Marketplace</li>
          <li>💰 Best Deals on Campus</li>
          <li>🔒 Secure Transactions</li>
          <li>🚀 Fast & Easy Selling</li>
        </ul>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Students Say</h2>
        <blockquote>
          "Sold my old books in a day! Super convenient and easy to use." – Sarah
        </blockquote>
        <blockquote>
          "Best place to buy second-hand gadgets on campus." – Kevin
        </blockquote>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Start Buying & Selling Today</h2>
        <button className="cta-button">Join Now</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Phantom Market. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
