import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { logout, getSession } from '../auth/session';
import Dashboard from '../api/Dashboard';
import ScreenDashboard from '../api/ScreensApi/ScreenDashboard';
import TicketDashboard from '../api/TicketsApi/TicketDashboard';
import UserDashboard from '../api/UsersApi/UserDashboard';

const AdminPanel = () => {
    const navigate = useNavigate();
    const session = getSession();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <header className="app-header d-flex justify-content-between align-items-center" style={{ padding: '0 20px' }}>
                <h1 className="app-title">🎥 CinemAPI - Panel Admin</h1>
                <div className="text-white">
                    <span className="me-3">{session?.email}</span>
                    <Button size="sm" variant="outline-light" onClick={handleLogout}>Salir</Button>
                </div>
            </header>
            <Dashboard />
            <ScreenDashboard />
            <TicketDashboard />
            <UserDashboard />
        </div>
    );
};

export default AdminPanel;
