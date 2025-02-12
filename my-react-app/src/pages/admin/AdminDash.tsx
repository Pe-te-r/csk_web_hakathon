import { Outlet, Route, Routes } from "react-router-dom";
import AdminSideNav from "./AdminSIdeNav";
import styles from "../../styles/AdminDash.module.scss";
import AdminUsers from "./pages/AdminUsers";
import ProductAdmin from "./pages/ProductAdmin";
import CategoryPage from "./pages/AdminCategory";
import SubcategoryPage from "./pages/SubcategoryPage";
import OrdersPage from "./pages/OrdersPage";

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
          <Route path="/category" element={<CategoryPage/>} />
          <Route path="/products" element={<ProductAdmin/>} />
          <Route path="/subcategory" element={<SubcategoryPage/>} />
          <Route path="/orders" element={<OrdersPage/>} />
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDash;
