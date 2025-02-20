import { Outlet, Route, Routes } from "react-router-dom";
import styles from "../../styles/AdminDash.module.scss";
import Home from "./pages/Home";
import UserSideNav from "./UserSIdeNav";
import AdminProduct from "../admin/pages/ProductAdmin";
import UserOrders from "./pages/UserOrders";

const UserDash = () => {
  return (
    <div className={styles.home}>
      <div className={styles.sidebar}>
        <UserSideNav />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<AdminProduct/>} />
          <Route path="/orders" element={<UserOrders/>} />

        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default UserDash;
