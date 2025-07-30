import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../services/AuthContext.jsx';
import { useNavigate } from 'react-router';
import "./css/style.scss";
import { ClipLoader } from 'react-spinners';

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            if (document.readyState === "complete") {
                setLoading(false)
            }
        }, 500)
    }, [])
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }
    if (isLoading) {
        return <div className="Loading loading-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClipLoader
                color={"#2b2b2b"}
                loading={isLoading}
            />
        </div>;
    }
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Welcome back, {user.name}!</h2>
                <p className="welcome-message">Nice to see you again</p>
            </header>
            <div className="user-info-card">
                <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                    <h3>{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;