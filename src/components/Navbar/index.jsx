import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import "./css/styles.css";
import HomeImg from "../../imgs/home.png";
import ProductsImg from "../../imgs/products.png";
import SettingsImg from "../../imgs/settings.png";
import CartImg from "../../imgs/cart.png";

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        
        try {
            return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
        } catch (error) {
            console.error('Failed to read theme:', error);
            return 'light';
        }
    });

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }, [theme]);

    return [theme, toggleTheme];
};

export default function Navbar() {
    const location = useLocation();
    const [theme, toggleTheme] = useTheme();

    // Handle active link highlighting
    useEffect(() => {
        const links = document.querySelectorAll(".nav-link");
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            link.classList.toggle("active", linkPath === location.pathname);
        });
    }, [location.pathname]);

    return (
        <header className={`navbar-container ${theme}`}>
            <div className="navbar">
                <Link className="nav-link" to="/">
                    <img src={HomeImg} alt="Home" />
                </Link>
                <Link className="nav-link" to="/products">
                    <img src={ProductsImg} alt="Products" />
                </Link>
                <Link className="nav-link" to="/cart">
                    <img src={CartImg} alt="Cart" />
                </Link>
                <Link className="nav-link" to="/settings">
                    <img src={SettingsImg} alt="Settings" />
                </Link>
                <button onClick={toggleTheme} className="theme-toggle">
                    
                </button>
            </div>
        </header>
    );
}