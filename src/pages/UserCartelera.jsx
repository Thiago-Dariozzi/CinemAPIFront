import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, logout } from '../auth/session';
import Dashboard from '../components/Movies/Dashboard';

const UserCartelera = () => {
    const session = getSession();

    if (session && session.role === "Client" && !session.userId) {
        logout();
        return <Navigate to="/login" replace />;
    }

    return <Dashboard readOnly />;
};

export default UserCartelera;
