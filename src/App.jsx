import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router";
import Home from "./Pages/Home/index.jsx";
import Products from "./Pages/Products/index.jsx";
import Cart from "./Pages/Cart/index.jsx";
import "./css/style.scss";
import Navbar from "./components/Navbar/index.jsx";
import CustomCursor from './components/cursor/index.jsx';
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./services/AuthContext.jsx";
import Login from "./Pages/Login/index.jsx";
import Signup from "./Pages/Signup/index.jsx";
import Dashboard from "./Pages/Dashboard/index.jsx";
import { ClipLoader } from "react-spinners";
import Background from "./components/background/index.jsx";

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check localStorage for user data
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your preferred loading indicator
  }

  if (!isAuthenticated && location.pathname !== "/signup" && location.pathname !== "/login") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AuthRedirect() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check localStorage for user data - use consistent key
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    setLoading(false);
    console.log('Current location:', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Only redirect if not already on auth pages and user is not authenticated
    if (!loading && !isAuthenticated) {
      const isOnAuthPage = location.pathname === '/login' || location.pathname === '/signup';
      if (!isOnAuthPage) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      if (document.readyState === "complete") {
        setLoading(false)
      }
    }, 500)
  }, [])
  
  useEffect(() => {
    const titleMap = {
      "/": "Home - Market Store",
      "/products": "Products - Market Store",
      "/cart": "Cart - Market Store",
      "/settings": "Settings - Market Store",
      "/dashboard": "Dashboard - Market Store"
    };

    document.title = titleMap[location.pathname] || "Market Store";
  }, [location.pathname]);

  if (isLoading) {
    return <div className="Loading loading-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ClipLoader
        color={"#2b2b2b"}
        loading={isLoading}
      />
    </div>;
  }
  
  return (
    <>
      <Background />
      <AuthProvider>
        <AuthRedirect />
        <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div className="main-content" style={{ flex: 1 }}>
            <Routes>
              {/* Public routes with auth check */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />

              {/* Protected routes */}
              <Route path="/cart" element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              {/* Redirect to home for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Navbar - shown on all routes except auth pages */}
          {!['/login', '/signup'].includes(location.pathname) && (
            <div style={{ height: "64px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Navbar className="navbar-fixed" />
            </div>
          )}
        </div>
        <CustomCursor />
      </AuthProvider>
    </>
  );
}

export default App;