import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";  // Fixed import - should be react-router-dom
import "./css/styles.scss";
import { IoMdHome } from "react-icons/io";
import { FaShoppingCart, FaStore, FaSun, FaMoon } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

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
                    <IoMdHome />
                </Link>
                <Link className="nav-link" to="/products">
                    <FaStore />
                </Link>
                <Link className="nav-link" to="/cart">
                    <FaShoppingCart />
                </Link>
                <Link className="nav-link" to="/dashboard">
                    <IoSettings />
                </Link>
                <button onClick={toggleTheme} className="theme-toggle nav-link">
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>
            </div>
        </header>
    );
}