import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import  Home from "./pages/Home";
import Register from "./pages/Register";
import LoginForm from "./pages/Login";
import ProductsPage from "./pages/ProductPage";
import AdminDash from "./pages/admin/AdminDash";
import Account from "./pages/Account";
import AboutUs from "./pages/AboutUs";
import ProtectedRoute from "./components/context/ProtectedRoute";
import SellerPageApplication from "./pages/users/SellerPageApplication";

const App = () => {
  return (
  
    <Router>
      <Navbar />
      <div style={{ marginTop: "20px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={ <Home/>} />
          <Route path="/register" element={ <Register/>} />
          <Route path="/login" element={ <LoginForm/>} />
          <Route path="/products" element={ <ProductsPage/>} />
          <Route path="/account"element={<ProtectedRoute><Account /></ProtectedRoute>}/>
          <Route path="/about" element={<AboutUs/>}/>
          <Route path="/application" element={<SellerPageApplication/>}/>
          <Route path="/admin/*"element={<ProtectedRoute><AdminDash /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App