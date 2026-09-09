import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, logout } from '../auth/session';
import TicketDashboard from '../components/Tickets/TicketDashboard';

const UserTickets = () => {
    const session = getSession();

    if (session && session.role === "Client" && !session.userId) {
        logout();
        return <Navigate to="/login" replace />;
    }

    return <TicketDashboard scopeUserId={session?.userId} />;
};

export default UserTickets;
