import { Navigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { homePathFor } from './roles';

const ProtectedRoute = ({ children, roles }) => {
    const session = useSession();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(session.role)) {
        return <Navigate to={homePathFor(session.role)} replace />;
    }

    return children;
};

export default ProtectedRoute;
