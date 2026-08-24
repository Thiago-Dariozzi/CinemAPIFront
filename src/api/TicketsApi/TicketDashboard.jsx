import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAllTickets, getTicketsByUser, addTicket, updateTicket, deleteTicket } from './TicketApi';
import { getAllMovies } from '../MoviesApi/movieApi';
import { getAllScreens } from '../ScreensApi/ScreenApi';
import { getAllUsers } from '../UsersApi/UserApi';
import NewTicket from './NewTicket';
import TicketContainer from './TicketContainer';

// scopeUserId: si viene seteado (panel de Usuario) esta pantalla solo trae/crea tickets
// de ese usuario puntual, vía GET /api/ticket/user/{userId}. Sin scopeUserId (panel de
// Admin) ve y administra los tickets de todos.
const TicketDashboard = ({ scopeUserId }) => {
    const [tickets, setTickets] = useState([]);
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const onTicketsSuccess = (data) => {
            setTickets(data);
            setIsLoading(false);
        };
        const onTicketsError = (err) => {
            console.error(err);
            setError("No se pudo conectar con el servidor de tickets. ¿Está corriendo el backend?");
            setIsLoading(false);
        };

        if (scopeUserId) {
            getTicketsByUser(scopeUserId, onTicketsSuccess, onTicketsError);
        } else {
            getAllTickets(onTicketsSuccess, onTicketsError);
        }

        // Películas, salas y usuarios se traen aparte para poder mostrar nombres
        // (y elegirlos por combo) en vez de tipear/mostrar GUIDs en los tickets.
        getAllMovies()
            .then(setMovies)
            .catch((err) => console.error(err));

        getAllScreens()
            .then(setScreens)
            .catch((err) => console.error(err));

        // La lista completa de usuarios solo hace falta para el combo "Usuario" del panel
        // de Admin; un Client tiene su userId fijo y no necesita ver la tabla de usuarios.
        if (!scopeUserId) {
            getAllUsers(setUsers, (err) => console.error(err));
        }
    }, [scopeUserId]);

    const handleAddTicket = (ticket) => {
        const ticketToSend = scopeUserId ? { ...ticket, userId: scopeUserId } : ticket;
        addTicket(
            ticketToSend,
            (created) => setTickets((prev) => [created, ...prev]),
            (err) => {
                console.error(err);
                setError("Error al agregar el ticket");
            }
        );
    };

    const handleDeleteTicket = (id) => {
        deleteTicket(
            id,
            () => setTickets((prev) => prev.filter((ticket) => ticket.id !== id)),
            (err) => {
                console.error(err);
                setError("Error al eliminar el ticket");
            }
        );
    };

    const handleUpdateTicket = (id, ticket) => {
        // Defensa extra: aunque el form no deje tocar el usuario cuando está scoped, nos
        // aseguramos de no mandar un userId distinto al del dueño de la pantalla.
        const ticketToSend = scopeUserId ? { ...ticket, userId: scopeUserId } : ticket;
        updateTicket(
            id,
            ticketToSend,
            (updated) => setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t))),
            (err) => {
                console.error(err);
                setError("Error al actualizar el ticket");
            }
        );
    };

    return (
        <Container className="py-4">
            <h1 style={{ color: '#ffbd59' }} className="mb-4">🎟️ {scopeUserId ? "Mis Tickets" : "Tickets"}</h1>
            {error && <p className="text-danger">{error}</p>}
            <NewTicket onAddTicket={handleAddTicket} movies={movies} screens={screens} users={users} fixedUserId={scopeUserId} />
            <TicketContainer
                isLoading={isLoading}
                tickets={tickets}
                movies={movies}
                screens={screens}
                users={users}
                fixedUserId={scopeUserId}
                onDelete={handleDeleteTicket}
                onEdit={handleUpdateTicket}
            />
        </Container>
    );
};

export default TicketDashboard;
