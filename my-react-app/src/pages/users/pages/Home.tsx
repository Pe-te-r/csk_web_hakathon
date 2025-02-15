import React from 'react';
import styles from '../../../styles/SellerDashboardHomepage.module.scss'; // Import SCSS module

const Home: React.FC = () => {
  // Static data for the seller dashboard homepage
  const recentActivity = [
    { id: 1, description: "You listed a new product: 'Used Calculus Textbook'", time: "2 hours ago" },
    { id: 2, description: "Your product 'Graphing Calculator' was sold", time: "1 day ago" },
    { id: 3, description: "You received a new message from a buyer", time: "3 days ago" },
  ];

  const quickActions = [
    { id: 1, title: "Add New Product", link: "/add-product" },
    { id: 2, title: "View Messages", link: "/messages" },
    { id: 3, title: "Check Sales Report", link: "/sales-report" },
    { id: 4, title: "Update Payment Method", link: "/payment-method" },
  ];

  const platformUpdates = [
    { id: 1, description: "New feature: In-app messaging for buyers and sellers", date: "2023-10-15" },
    { id: 2, description: "Security update: Enhanced 2FA options now available", date: "2023-10-10" },
    { id: 3, description: "Policy update: Revised seller guidelines for better trading", date: "2023-10-05" },
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Welcome to Your Seller Dashboard</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <ul className={styles.list}>
          {recentActivity.map((activity) => (
            <li key={activity.id} className={styles.listItem}>
              <span className={styles.activityDescription}>{activity.description}</span>
              <span className={styles.activityTime}>{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActions}>
          {quickActions.map((action) => (
            <a key={action.id} href={action.link} className={styles.actionCard}>
              {action.title}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Platform Updates</h2>
        <ul className={styles.list}>
          {platformUpdates.map((update) => (
            <li key={update.id} className={styles.listItem}>
              <span className={styles.updateDescription}>{update.description}</span>
              <span className={styles.updateDate}>{update.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;