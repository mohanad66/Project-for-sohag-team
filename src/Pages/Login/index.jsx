import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../services/AuthContext.jsx';
import { Link, useLocation, useNavigate } from 'react-router';
import "./css/style.scss";

function Login() {
    const { login } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    // Check for saved theme or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => 
                u.email === formData.email && 
                u.password === formData.password
            );

            if (!user) {
                throw new Error('Invalid email or password');
            }

            await login(user);
            navigate(from, { replace: true });
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" data-theme={theme}>
            <div className="login-container">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Please enter your credentials to login</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉️</span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;