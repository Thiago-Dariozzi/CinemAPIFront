import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAllTickets, getTicketsByUser, addTicket, updateTicket, deleteTicket } from '../../api/ticketApi';
import { getAllUsers } from '../../api/userApi';
import NewTicket from './NewTicket';
import TicketContainer from './TicketContainer';

const TicketDashboard = ({ scopeUserId }) => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = scopeUserId ? await getTicketsByUser(scopeUserId) : await getAllTickets();
                setTickets(data);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError("No se pudo conectar con el servidor de tickets. ¿Está corriendo el backend?");
                setIsLoading(false);
            }
        };

        loadTickets();

        // EN DUDA !!! Preguntar al profe si esto hay que sacarlo tambien
        if (!scopeUserId) {
            const loadUsers = async () => {
                try {
                    setUsers(await getAllUsers());
                } catch (err) {
                    console.error(err);
                }
            };
            loadUsers();
        }
    }, [scopeUserId]);

    const handleAddTicket = async (ticket) => {
        const ticketToSend = scopeUserId ? { ...ticket, userId: scopeUserId } : ticket;
        try {
            const created = await addTicket(ticketToSend);
            setTickets((prev) => [created, ...prev]);
        } catch (err) {
            console.error(err);
            setError("Error al agregar el ticket");
        }
    };

    const handleDeleteTicket = async (id) => {
        try {
            await deleteTicket(id);
            setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
        } catch (err) {
            console.error(err);
            setError("Error al eliminar el ticket");
        }
    };

    const handleUpdateTicket = async (id, ticket) => {
        const ticketToSend = scopeUserId ? { ...ticket, userId: scopeUserId } : ticket;
        try {
            const updated = await updateTicket(id, ticketToSend);
            setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
        } catch (err) {
            console.error(err);
            setError("Error al actualizar el ticket");
        }
    };

    return (
        <Container className="py-4">
            <h1 className="accent-title mb-4">🎟️ {scopeUserId ? "Mis Tickets" : "Tickets"}</h1>
            {error && <p className="text-danger">{error}</p>}
            <NewTicket onAddTicket={handleAddTicket} users={users} fixedUserId={scopeUserId} />
            <TicketContainer
                isLoading={isLoading}
                tickets={tickets}
                users={users}
                fixedUserId={scopeUserId}
                onDelete={handleDeleteTicket}
                onEdit={handleUpdateTicket}
            />
        </Container>
    );
};

export default TicketDashboard;
