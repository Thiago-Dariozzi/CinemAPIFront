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

export const getAllTickets = (onSuccess, onError) => {
    fetch(API_BASE, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los tickets");
            return response.json();
        })
        .then((data) => onSuccess(data.map(mapTicketFromBackend)))
        .catch((error) => onError(error));
};

export const getTicketById = (id, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener el ticket");
            return response.json();
        })
        .then((data) => onSuccess(mapTicketFromBackend(data)))
        .catch((error) => onError(error));
};

export const getTicketsByUser = (userId, onSuccess, onError) => {
    fetch(`${API_BASE}/user/${userId}`, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los tickets del usuario");
            return response.json();
        })
        .then((data) => onSuccess(data.map(mapTicketFromBackend)))
        .catch((error) => onError(error));
};

export const addTicket = (ticket, onSuccess, onError) => {
    fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapTicketToBackendForCreate(ticket)),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al crear el ticket");
            return response.json();
        })
        .then((data) => onSuccess(mapTicketFromBackend(data)))
        .catch((error) => onError(error));
};

export const updateTicket = (id, ticket, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapTicketToBackendForUpdate(id, ticket)),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al actualizar el ticket");
            onSuccess({ id, ...ticket, isActive: true });
        })
        .catch((error) => onError(error));
};

export const deleteTicket = (id, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al eliminar el ticket");
            onSuccess(id);
        })
        .catch((error) => onError(error));
};
