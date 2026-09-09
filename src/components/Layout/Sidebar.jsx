import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getSession, logout } from '../../auth/session';

const adminItems = [
    { path: '/admin/peliculas', label: 'Películas', icon: '🎬' },
    { path: '/admin/generos', label: 'Géneros', icon: '🎭' },
    { path: '/admin/salas', label: 'Salas', icon: '🏛️' },
    { path: '/admin/tickets', label: 'Tickets', icon: '🎟️' },
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👤' },
];

const userItems = [
    { path: '/panel/cartelera', label: 'Cartelera', icon: '🎬' },
    { path: '/panel/mis-tickets', label: 'Mis Tickets', icon: '🎟️' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const session = getSession();
    const isAdmin = session?.role === 'Admin';
    const items = isAdmin ? adminItems : userItems;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <h2 className="sidebar__title">🎥 CinemAPI</h2>
                <span className="sidebar__role">{isAdmin ? 'Admin' : 'Usuario'}</span>
            </div>

            <nav className="sidebar__nav">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                        }
                    >
                        <span className="sidebar__icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__footer">
                <span className="sidebar__email">{session?.email}</span>
                <button className="sidebar__logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
