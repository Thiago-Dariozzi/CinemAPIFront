import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { ROLES, STAFF_ROLES } from './roles';

const signInAs = (role) => localStorage.setItem('cinemapi_session', JSON.stringify({
    token: 'token-de-prueba',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    userId: 'u1',
    name: 'Usuario',
    email: 'usuario@cine.test',
    role,
}));

const LoginProbe = () => {
    const location = useLocation();
    return <p>Login (volver a {location.state?.from ?? 'ningún lado'})</p>;
};

const renderAt = (path) => render(
    <MemoryRouter initialEntries={[path]}>
        <Routes>
            <Route path="/login" element={<LoginProbe />} />
            <Route path="/cartelera" element={<p>Cartelera</p>} />
            <Route path="/admin/peliculas" element={<p>Panel del staff</p>} />
            <Route path="/admin/ventas" element={<ProtectedRoute roles={STAFF_ROLES}><p>Ventas</p></ProtectedRoute>} />
            <Route path="/admin/cargos" element={<ProtectedRoute roles={[ROLES.superAdmin]}><p>Cargos</p></ProtectedRoute>} />
            <Route path="/panel/mis-entradas" element={<ProtectedRoute roles={[ROLES.client]}><p>Mis entradas</p></ProtectedRoute>} />
        </Routes>
    </MemoryRouter>,
);

describe('ProtectedRoute', () => {
    it('sin sesión manda al login recordando a dónde se quería ir', () => {
        renderAt('/panel/mis-entradas');

        expect(screen.getByText('Login (volver a /panel/mis-entradas)')).toBeInTheDocument();
        expect(screen.queryByText('Mis entradas')).not.toBeInTheDocument();
    });

    it('deja pasar a un cliente a sus pantallas', () => {
        signInAs(ROLES.client);
        renderAt('/panel/mis-entradas');

        expect(screen.getByText('Mis entradas')).toBeInTheDocument();
    });

    it('a un cliente que entra a una pantalla del staff lo manda a la cartelera', () => {
        signInAs(ROLES.client);
        renderAt('/admin/ventas');

        expect(screen.getByText('Cartelera')).toBeInTheDocument();
        expect(screen.queryByText('Ventas')).not.toBeInTheDocument();
    });

    it('deja pasar a un Admin a Ventas, pero no a Cargos (solo SuperAdmin)', () => {
        signInAs(ROLES.admin);
        renderAt('/admin/cargos');

        expect(screen.getByText('Panel del staff')).toBeInTheDocument();
        expect(screen.queryByText('Cargos')).not.toBeInTheDocument();
    });

    it('deja pasar a un SuperAdmin a Cargos', () => {
        signInAs(ROLES.superAdmin);
        renderAt('/admin/cargos');

        expect(screen.getByText('Cargos')).toBeInTheDocument();
    });

    it('a un Admin que entra a una pantalla del cliente lo manda a su panel', () => {
        signInAs(ROLES.admin);
        renderAt('/panel/mis-entradas');

        expect(screen.getByText('Panel del staff')).toBeInTheDocument();
    });

    it('trata una sesión vencida como si no hubiera sesión', () => {
        localStorage.setItem('cinemapi_session', JSON.stringify({
            token: 't', expiresAt: new Date(Date.now() - 1000).toISOString(), role: ROLES.client,
        }));
        renderAt('/panel/mis-entradas');

        expect(screen.getByText(/^Login/)).toBeInTheDocument();
    });
});
