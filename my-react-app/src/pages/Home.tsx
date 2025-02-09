import styles from '../styles/Home.module.scss';
import imgBook from '../assets/books.jpeg';
import imgElectronic from '../assets/electronics.jpeg';
import imgFashion from '../assets/Fashion.jpeg';
import imgBike from '../assets/bike.jpeg';
import imgHostel from '../assets/hostel.jpeg';
import imgShoe from '../assets/shoes.jpeg';
import imgLaptop from '../assets/laptop.jpeg';
import imgHeadphones from '../assets/headphones.jpeg';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../components/context/UserProvider';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate()
      const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = () => {
    if (step === 1 && email) {
      setStep(2);
    }
  };
    
    const { getUser } = useUser()

  const to_register = () => {
    navigate('/register')
  }

  const handleSubmit = () => {
    if (step === 2 && password) {
      // Static login data for demonstration
      const staticEmail = 'phantom8526@duck.com';
      const staticPassword = '1234';

      if (email === staticEmail && password === staticPassword) {
        toast.success('Login successful!');
      } else {
        toast.error('Invalid email or password.');
      }
    }
  };

  return (
    <div className={styles['home-container']}>
      {/* Hero Section */}
  <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Phantom Market</h1>
          <p>Buy & sell easily within your campus. Find great deals or become a seller today!</p>

          {/* Multi-step login form for large screens and tablets */}
          {!getUser() &&
          <div className={styles.loginForm}>
            <h3 className={styles.formHeader}>Login</h3>
            {step === 1 && (
              <div className={styles.formStep}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleNext}>Next</button>
              </div>
            )}

            {step === 2 && (
              <div className={styles.formStep}>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                <button onClick={handleSubmit}>Login</button>
              </div>
            )}
          </div>

}
          {/* Fallback button for small screens */}
          {!getUser() &&
          <button className={styles['cta-button']} aria-label="Get Started" onClick={to_register}>
            Get Started
          </button>
}
            </div>
      </section>

      {/* Featured Categories */}
      <section className={styles.categories} aria-labelledby="categories-heading">
        <h2 id="categories-heading">Shop by Categories</h2>
        <div className={styles['category-grid']}>
          {[
            { img: imgBook, alt: 'Books', text: 'Books & Stationery' },
            { img: imgElectronic, alt: 'Electronics', text: 'Electronics & Gadgets' },
            { img: imgFashion, alt: 'Fashion', text: 'Clothing & Accessories' },
            { img: imgBike, alt: 'Transport', text: 'Bikes & Motorcycles' },
            { img: imgHostel, alt: 'Hostel Essentials', text: 'Hostel Essentials' },
          ].map((category, index) => (
            <div key={index} className={styles['category-card']}>
              <img src={category.img} alt={category.alt} loading="lazy" />
              <p>{category.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Items */}
      <section className={styles.trending} aria-labelledby="trending-heading">
        <h2 id="trending-heading">Trending Items</h2>
        <div className={styles['trending-grid']}>
          {[
            { img: imgHeadphones, alt: 'Headphones', text: 'Wireless Headphones - $49.99' },
            { img: imgLaptop, alt: 'Laptop', text: 'Used Laptop - $299.99' },
            { img: imgShoe, alt: 'Shoes', text: 'Running Shoes - $39.99' },
          ].map((item, index) => (
            <div key={index} className={styles['trending-item']}>
              <img src={item.img} alt={item.alt} loading="lazy" />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
<section className={styles['how-it-works']} aria-labelledby="how-it-works-heading">
  <h2 id="how-it-works-heading">How It Works</h2>
  <div className={styles.steps}>
    <div className={styles.step}>
      <div className={styles.stepIcon}>1️⃣</div>
      <h3>Register & Verify</h3>
      <p>Sign up with your student email and verify your account to get started.</p>
    </div>
    <div className={styles.step}>
      <div className={styles.stepIcon}>2️⃣</div>
      <h3>Browse & Buy</h3>
      <p>Explore thousands of items listed by fellow students and grab the best deals.</p>
    </div>
    <div className={styles.step}>
      <div className={styles.stepIcon}>3️⃣</div>
      <h3>Apply to Sell</h3>
      <p>Submit a request to become a seller and start listing your items.</p>
    </div>
    <div className={styles.step}>
      <div className={styles.stepIcon}>4️⃣</div>
      <h3>List & Sell Items</h3>
      <p>Upload your items, set your price, and sell to other students on campus.</p>
    </div>
  </div>
</section>

      {/* Why Choose Us */}
<section className={styles['why-choose']} aria-labelledby="why-choose-heading">
  <h2 id="why-choose-heading">Why Choose Phantom Market?</h2>
  <div className={styles.benefits}>
    <div className={styles.benefit}>
      <div className={styles.benefitIcon}>🎓</div>
      <h3>Student-Focused</h3>
      <p>Designed specifically for university students, ensuring a <strong>safe</strong> and <strong>reliable</strong> environment.</p>
    </div>
    <div className={styles.benefit}>
      <div className={styles.benefitIcon}>🔒</div>
      <h3>Secure Transactions</h3>
      <p>We prioritize security, making sure all transactions are transparent and fraud-free.</p>
    </div>
    <div className={styles.benefit}>
      <div className={styles.benefitIcon}>💰</div>
      <h3>Affordable Prices</h3>
      <p>Buy and sell at <strong>reasonable prices</strong>, making it easier to save money on essentials.</p>
    </div>
    <div className={styles.benefit}>
      <div className={styles.benefitIcon}>🤝</div>
      <h3>Trusted Medium</h3>
      <p>Use us as your trusted medium if you don't trust your buyer or seller. We ensure a smooth and secure process.</p>
    </div>
  </div>
</section>

      {/* Testimonials */}
     <section className={styles.testimonials} aria-labelledby="testimonials-heading">
  <h2 id="testimonials-heading">What Students Say</h2>
  <div className={styles.testimonialGrid}>
    <div className={styles.testimonialCard}>
      <img src="/path/to/sarah-avatar.jpg" alt="Sarah" className={styles.avatar} />
      <blockquote>"Sold my old books in a day! Super convenient and easy to use."</blockquote>
      <p className={styles.author}>– Sarah</p>
    </div>
    <div className={styles.testimonialCard}>
      <img src="/path/to/kevin-avatar.jpg" alt="Kevin" className={styles.avatar} />
      <blockquote>"Best place to buy second-hand gadgets on campus."</blockquote>
      <p className={styles.author}>– Kevin</p>
    </div>
    <div className={styles.testimonialCard}>
      <img src="/path/to/emma-avatar.jpg" alt="Emma" className={styles.avatar} />
      <blockquote>"I found affordable textbooks and made new friends. Highly recommend!"</blockquote>
      <p className={styles.author}>– Emma</p>
    </div>
  </div>
</section>

      {/* Call to Action */}
<section className={styles.cta} aria-labelledby="cta-heading">
  <div className={styles.ctaContent}>
    <h2 id="cta-heading">Start Buying & Selling Today</h2>
    <p>Join thousands of students who are already saving money and making connections on Phantom Market.</p>
          {!getUser &&
    <button className={styles['cta-button']} onClick={to_register} aria-label="Join Now">Join Now</button>
    }
  </div>
</section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2025 Phantom Market. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;