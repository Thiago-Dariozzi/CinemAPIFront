import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAllTickets, getTicketsByUser, addTicket, updateTicket, deleteTicket } from '../../api/ticketApi';
import { getAllMovies } from '../../api/movieApi';
import { getAllScreens } from '../../api/screenApi';
import { getAllUsers } from '../../api/userApi';
import NewTicket from './NewTicket';
import TicketContainer from './TicketContainer';

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

        getAllMovies()
            .then(setMovies)
            .catch((err) => console.error(err));

        getAllScreens()
            .then(setScreens)
            .catch((err) => console.error(err));

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
            <h1 className="accent-title mb-4">🎟️ {scopeUserId ? "Mis Tickets" : "Tickets"}</h1>
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
