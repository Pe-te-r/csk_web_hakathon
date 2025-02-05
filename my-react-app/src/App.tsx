import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import { Home } from "./pages/Home";
import Register from "./pages/Register";
import LoginForm from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "20px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={ <Home/>} />
          <Route path="/register" element={ <Register/>} />
          <Route path="/login" element={ <LoginForm/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App