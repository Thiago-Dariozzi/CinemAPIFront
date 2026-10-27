import { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LazyOutlet from './LazyOutlet';
import { logout } from '../../auth/session';
import { ROLES, isStaff } from '../../auth/roles';
import { useSession } from '../../hooks/useSession';

const accountLinks = (session, location) => {
    if (!session) {
        const from = `${location.pathname}${location.search}`;
        return (
            <>
                <Nav.Link as={NavLink} to="/login" state={{ from }}>Ingresar</Nav.Link>
                <Nav.Link as={NavLink} to="/registro" state={{ from }} className="public-nav__cta">Crear cuenta</Nav.Link>
            </>
        );
    }

    return (
        <>
            {session.role === ROLES.client && (
                <>
                    <Nav.Link as={NavLink} to="/panel/mis-entradas">Mis entradas</Nav.Link>
                    <Nav.Link as={NavLink} to="/panel/perfil">Mi perfil</Nav.Link>
                </>
            )}
            {isStaff(session.role) && <Nav.Link as={NavLink} to="/admin/peliculas">Panel de administración</Nav.Link>}
            <Nav.Link as="button" type="button" onClick={logout} className="public-nav__logout">
                Salir ({session.name})
            </Nav.Link>
        </>
    );
};

const PublicLayout = () => {
    const session = useSession();
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="public-layout">
            <Navbar expand="md" variant="dark" sticky="top" expanded={expanded} onToggle={setExpanded} className="public-nav">
                <Container>
                    <Navbar.Brand as={Link} to="/cartelera" className="public-nav__brand" onClick={() => setExpanded(false)}>🎥 CinemAPI</Navbar.Brand>
                    <Navbar.Toggle aria-controls="public-nav-links" aria-label="Abrir el menú" />
                    <Navbar.Collapse id="public-nav-links">
                        <Nav className="ms-auto align-items-md-center" onClick={() => setExpanded(false)}>
                            <Nav.Link as={NavLink} to="/cartelera">Cartelera</Nav.Link>
                            {accountLinks(session, location)}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container as="main" className="public-layout__content">
                <LazyOutlet />
            </Container>

            <footer className="public-footer">
                <Container>🎥 CinemAPI · Cartelera, horarios y entradas</Container>
            </footer>
        </div>
    );
};

export default PublicLayout;
