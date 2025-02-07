import { NavLink } from 'react-router-dom';
import styles from '../../styles/AdminSideNav.module.scss';
import { FaUser, FaCog, FaHome, FaProductHunt } from 'react-icons/fa';

const AdminSideNav = () => {
  return (
    <nav className={styles.sidenav}>
      <div className={styles.logo}>Dashboard</div>
      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <FaHome /> Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <FaUser /> Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <FaProductHunt /> Product
          </NavLink>
        </li>
    <li>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <FaCog /> Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSideNav;
