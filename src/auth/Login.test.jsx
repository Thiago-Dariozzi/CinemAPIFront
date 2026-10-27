import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';

const problem = (status, detail) =>
    new Response(JSON.stringify({ title: "Error", status, detail }), {
        status,
        headers: { 'Content-Type': 'application/problem+json' },
    });

const renderLogin = () => render(<MemoryRouter><Login /></MemoryRouter>);

describe('Login', () => {
    afterEach(() => vi.restoreAllMocks());

    it('muestra el mensaje del backend cuando las credenciales son incorrectas', async () => {
        const user = userEvent.setup();
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(problem(401, "Email o contraseña incorrectos."));
        renderLogin();

        await user.type(screen.getByLabelText('Email'), 'cliente@cinemapi.com');
        await user.type(screen.getByLabelText('Contraseña'), 'incorrecta');
        await user.click(screen.getByRole('button', { name: 'Ingresar' }));

        expect(await screen.findByText("Email o contraseña incorrectos.")).toBeInTheDocument();
        expect(localStorage.getItem('cinemapi_session')).toBeNull();
        expect(screen.getByLabelText('Email')).toHaveValue('cliente@cinemapi.com');
    });

    it('no llama a la API si el email no tiene formato válido', async () => {
        const user = userEvent.setup();
        const fetchSpy = vi.spyOn(globalThis, 'fetch');
        renderLogin();

        await user.type(screen.getByLabelText('Email'), 'no-es-un-email');
        await user.type(screen.getByLabelText('Contraseña'), 'algo');

        expect(screen.getByRole('button', { name: 'Ingresar' })).toBeDisabled();
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('muestra un error claro si el servidor no responde', async () => {
        const user = userEvent.setup();
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
        renderLogin();

        await user.type(screen.getByLabelText('Email'), 'cliente@cinemapi.com');
        await user.type(screen.getByLabelText('Contraseña'), 'clave-de-prueba');
        await user.click(screen.getByRole('button', { name: 'Ingresar' }));

        expect(await screen.findByText("No se pudo iniciar sesión")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ingresar' })).toBeEnabled();
    });
});
