import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import { Home } from "./pages/Home";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "20px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={ <Home/>} />
          <Route path="/register" element={ <Register/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App