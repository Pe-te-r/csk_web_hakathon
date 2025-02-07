import { Outlet, Route, Routes } from "react-router-dom";
import AdminSideNav from "./AdminSIdeNav";
import styles from "../../styles/AdminDash.module.scss";
import AdminUsers from "./pages/AdminUsers";

const AdminDash = () => {
  return (
    <div className={styles.home}>
      <div className={styles.sidebar}>
        <AdminSideNav />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<div>Welcome to the Admin Home</div>} />
          <Route path="/users" element={<AdminUsers/>} />
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDash;
