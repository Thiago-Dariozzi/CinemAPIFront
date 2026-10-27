import { NavLink } from 'react-router-dom';
import { logout } from '../../auth/session';
import { ROLES, ROLE_LABELS } from '../../auth/roles';
import { useSession } from '../../hooks/useSession';

const staffItems = [
    { path: '/admin/peliculas', label: 'Películas', icon: '🎬' },
    { path: '/admin/generos', label: 'Géneros', icon: '🎭' },
    { path: '/admin/salas', label: 'Salas', icon: '🏛️' },
    { path: '/admin/ventas', label: 'Ventas', icon: '💰' },
    { path: '/admin/clientes', label: 'Clientes', icon: '👥' },
];

const superAdminItems = [
    { path: '/admin/administradores', label: 'Administradores', icon: '🛡️' },
    { path: '/admin/cargos', label: 'Cargos', icon: '🧾' },
];

const commonItems = [
    { path: '/cartelera', label: 'Ver cartelera', icon: '🍿' },
    { path: '/admin/perfil', label: 'Mi perfil', icon: '👤' },
];

const itemsFor = (role) => (role === ROLES.superAdmin
    ? [...staffItems, ...superAdminItems, ...commonItems]
    : [...staffItems, ...commonItems]);

const Sidebar = () => {
    const session = useSession();
    if (!session) return null;

    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <h2 className="sidebar__title">🎥 CinemAPI</h2>
                <span className="sidebar__role">{ROLE_LABELS[session.role] ?? session.role}</span>
            </div>

            <nav className="sidebar__nav">
                {itemsFor(session.role).map((item) => (
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
                <span className="sidebar__name">{session.name}</span>
                <span className="sidebar__email">{session.email}</span>
                <button className="sidebar__logout" onClick={logout}>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
