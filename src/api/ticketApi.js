const API_BASE = "http://localhost:5288/api/ticket";

const mapTicketFromBackend = (ticket) => ({
    id: ticket.id,
    movieId: ticket.movieId,
    screenId: ticket.screenId,
    userId: ticket.userId,
    buyDate: ticket.buyDate,
    finalPrice: ticket.finalPrice,
    isActive: ticket.isActive,
});

const mapTicketToBackendForCreate = (ticket) => ({
    movieId: ticket.movieId,
    screenId: ticket.screenId,
    userId: ticket.userId,
    buyDate: ticket.buyDate,
    finalPrice: Number(ticket.finalPrice) || 0,
});

const mapTicketToBackendForUpdate = (id, ticket) => ({
    id,
    movieId: ticket.movieId,
    screenId: ticket.screenId,
    userId: ticket.userId,
    buyDate: ticket.buyDate,
    finalPrice: Number(ticket.finalPrice) || 0,
    isActive: true,
});

export const getAllTickets = async () => {
    const response = await fetch(API_BASE, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener los tickets");
    const data = await response.json();
    return data.map(mapTicketFromBackend);
};

export const getTicketById = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener el ticket");
    const data = await response.json();
    return mapTicketFromBackend(data);
};

export const getTicketsByUser = async (userId) => {
    const response = await fetch(`${API_BASE}/user/${userId}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener los tickets del usuario");
    const data = await response.json();
    return data.map(mapTicketFromBackend);
};

export const addTicket = async (ticket) => {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapTicketToBackendForCreate(ticket)),
    });
    if (!response.ok) throw new Error("Error al crear el ticket");
    const data = await response.json();
    return mapTicketFromBackend(data);
};

export const updateTicket = async (id, ticket) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapTicketToBackendForUpdate(id, ticket)),
    });
    if (!response.ok) throw new Error("Error al actualizar el ticket");
    return { id, ...ticket, isActive: true };
};

export const deleteTicket = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el ticket");
};
