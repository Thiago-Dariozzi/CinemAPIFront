import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { homePathFor } from './roles';

const ProtectedRoute = ({ children, roles }) => {
    const session = useSession();
    const location = useLocation();

    if (!session) {
        return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
    }

    if (roles && !roles.includes(session.role)) {
        return <Navigate to={homePathFor(session.role)} replace />;
    }

    return children;
};

export default ProtectedRoute;
