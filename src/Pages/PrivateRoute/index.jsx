import { Navigate } from 'react-router';
import { AuthContext , useAuth } from '../../services/AuthContext.jsx';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
export default PrivateRoute;