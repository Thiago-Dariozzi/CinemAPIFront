import { request } from "./httpClient";

const mapTicketFromBackend = (ticket) => ({
    id: ticket.id,
    movieId: ticket.movieId,
    screenId: ticket.screenId,
    userId: ticket.userId,
    buyDate: ticket.buyDate,
    finalPrice: ticket.finalPrice,
    isActive: ticket.isActive,
});

const mapTicketToBackend = (ticket) => ({
    movieId: ticket.movieId,
    screenId: ticket.screenId,
    userId: ticket.userId,
    buyDate: ticket.buyDate,
    finalPrice: Number(ticket.finalPrice) || 0,
});

export const getAllTickets = async () => {
    const data = await request("/ticket", { errorMessage: "Error al obtener los tickets" });
    return data.map(mapTicketFromBackend);
};

export const getTicketById = async (id) => {
    const data = await request(`/ticket/${id}`, { errorMessage: "Error al obtener el ticket" });
    return mapTicketFromBackend(data);
};

export const getTicketsByUser = async (userId) => {
    const data = await request(`/ticket/user/${userId}`, { errorMessage: "Error al obtener los tickets del usuario" });
    return data.map(mapTicketFromBackend);
};

export const addTicket = async (ticket) => {
    const data = await request("/ticket", {
        method: "POST",
        body: mapTicketToBackend(ticket),
        errorMessage: "Error al crear el ticket",
    });
    return mapTicketFromBackend(data);
};

export const updateTicket = async (id, ticket) => {
    const body = mapTicketToBackend(ticket);
    await request(`/ticket/${id}`, { method: "PUT", body, errorMessage: "Error al actualizar el ticket" });
    return { id, ...body, isActive: true };
};

export const deleteTicket = (id) =>
    request(`/ticket/${id}`, { method: "DELETE", errorMessage: "Error al eliminar el ticket" });
