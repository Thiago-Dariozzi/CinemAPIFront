import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { logout, getSession } from '../auth/session';
import Dashboard from '../components/Movies/Dashboard';
import TicketDashboard from '../components/Tickets/TicketDashboard';

const UserPanel = () => {
    const navigate = useNavigate();
    const session = getSession();

    if (session && session.role === "Client" && !session.userId) {
        logout();
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <header className="app-header d-flex justify-content-between align-items-center" style={{ padding: '0 20px' }}>
                <h1 className="app-title">🎥 CinemAPI - Panel Usuario</h1>
                <div className="text-white">
                    <span className="me-3">{session?.email}</span>
                    <Button size="sm" variant="outline-light" onClick={handleLogout}>Salir</Button>
                </div>
            </header>
            <Dashboard readOnly />
            <TicketDashboard scopeUserId={session?.userId} />
        </div>
    );
};

export default UserPanel;
