import { Outlet, Route, Routes } from "react-router-dom";
import AdminSideNav from "./AdminSIdeNav";
import styles from "../../styles/AdminDash.module.scss";
import AdminUsers from "./pages/AdminUsers";
import ProductAdmin from "./pages/ProductAdmin";
import CategoryPage from "./pages/AdminCategory";
import SubcategoryPage from "./pages/AdminSubcategoryPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";

const AdminDash = () => {
  return (
    <div className={styles.home}>
      <div className={styles.sidebar}>
        <AdminSideNav />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<AdminDashboard/>} />
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
