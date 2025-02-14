import { NavLink } from 'react-router-dom';
import styles from '../../styles/AdminSideNav.module.scss';
import {  FaCog, FaHome, FaProductHunt } from 'react-icons/fa';

import { BsBoxSeam } from 'react-icons/bs';

const UserSideNav = () => {
  return (
    <nav className={styles.sidenav}>
      <div className={styles.logo}>Dashboard</div>
      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <FaHome /> Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <BsBoxSeam /> Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/products"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <FaProductHunt /> Product
          </NavLink>
        </li>

    <li>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <FaCog /> Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default UserSideNav;
