import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from './session';

const ProtectedRoute = ({ children, role }) => {
    const session = getSession();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (role && session.role !== role) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
