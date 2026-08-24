import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from './session';

// Envuelve una página que requiere sesión iniciada. Si además se pasa `role`, exige que
// la sesión tenga ese rol puntual (por ahora no lo usamos: cualquier cuenta logueada
// entra a su propio panel, pero queda listo para restringir más adelante).
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
