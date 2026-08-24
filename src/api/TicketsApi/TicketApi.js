// TicketApi.js
// Centraliza todos los fetch de la entidad Ticket (getAll, getById, getByUser, create, update, remove).
// Cada función recibe onSuccess/onError como callbacks (estilo Dashboard.server.js).
// El mapeo entre el shape del backend y el shape que usa el front vive acá, no en los componentes.
//
// Shape real del backend (Domain.Entities.Ticket):
//   Id, MovieId, ScreenId, UserId, BuyDate, FinalPrice, IsActive
// (no tiene "seat"/butaca ni "price": son movieId/screenId/userId/buyDate/finalPrice).

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

// Para crear: el backend ignora Id/IsActive que mandemos (TicketService.Add los pisa),
// así que alcanza con mandar los datos "de negocio".
const mapTicketToBackendForCreate = (ticket) => ({
    movieId: ticket.movieId,
    screenId: ticket.screenId,
    userId: ticket.userId,
    buyDate: ticket.buyDate,
    finalPrice: Number(ticket.finalPrice) || 0,
});

// Para actualizar: TicketController.UpdateTicket valida que el id del body coincida con el
// de la ruta, y TicketService.Update hace un reemplazo completo de la entidad (no un patch).
// Si no mandamos isActive, System.Text.Json lo deserializa en false y el ticket "desaparece"
// (soft-delete accidental). Como solo se puede editar un ticket que ya está activo en la
// lista, mandamos isActive: true siempre.
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
