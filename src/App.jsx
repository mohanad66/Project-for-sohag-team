import { Routes, Route, useLocation } from "react-router"
import Home from "./Pages/Home/index.jsx"
import Products from "./Pages/Products/index.jsx"
import Settings from "./Pages/Settings/index.jsx"
import Cart from "./Pages/Cart/index.jsx"
import "./css/style.css"
import Navbar from "./components/Navbar/index.jsx"
import CustomCursor from './components/cursor/index.jsx';
import { ClipLoader } from "react-spinners";
import { useEffect } from "react"
function App() {
  const location = useLocation();

  useEffect(() => {
    // Set the document title based on the current route
    switch (location.pathname) {
      case "/":
        document.title = "Home - Market Store";
        break;
      case "/products":
        document.title = "Products - Market Store";
        break;
      case "/cart":
        document.title = "Cart - Market Store";
        break;
      case "/settings":
        document.title = "Settings - Market Store";
        break;
      default:
        document.title = "Market Store";
    }
  }, [location.pathname]); // Re-run when pathname changes

  return (
    <>
      <>
        <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div className="main-content" style={{ flex: 1 }}></div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        {/* Reserve space for Navbar to prevent layout shift */}
        <div style={{ height: "64px" }}>
          <Navbar className="navbar-fixed" />
        </div>

      </>
      <CustomCursor />
    </>
  )
}

export default App;