// showtimeApi.js
// Fetch de la entidad Showtime (horario/función): MovieId, ScreenId, StartTime, Price.
// Lo usa el panel de Usuario para armar el combo "Horario" de NewTicket, y el panel de
// Admin para dar de alta/baja las funciones de una película (MovieFunctionsPanel).

const API_BASE = "http://localhost:5288/api/showtime";

const mapShowtimeFromBackend = (showtime) => ({
    id: showtime.id,
    movieId: showtime.movieId,
    screenId: showtime.screenId,
    startTime: showtime.startTime,
    price: showtime.price,
});

// Para crear: el backend ignora Id/IsActive que mandemos (ShowtimeService.Add los pisa).
const mapShowtimeToBackendForCreate = (showtime) => ({
    movieId: showtime.movieId,
    screenId: showtime.screenId,
    startTime: showtime.startTime,
    price: Number(showtime.price) || 0,
});

export const getShowtimesByMovie = (movieId, onSuccess, onError) => {
    fetch(`${API_BASE}/movie/${movieId}`, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los horarios");
            return response.json();
        })
        .then((data) => onSuccess(data.map(mapShowtimeFromBackend)))
        .catch((error) => onError(error));
};

// Horarios ya ocupados de una sala en una fecha puntual (date: "YYYY-MM-DD"). Lo usa
// MovieFunctionsPanel para avisar ANTES de guardar si la franja elegida choca con otra
// función activa de esa sala, en vez de que el admin lo descubra recién al mandar el form.
export const getOccupiedShowtimesByScreen = (screenId, date, onSuccess, onError) => {
    fetch(`${API_BASE}/screen/${screenId}?date=${date}`, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener la ocupación de la sala");
            return response.json();
        })
        .then((data) => onSuccess(data.map(mapShowtimeFromBackend)))
        .catch((error) => onError(error));
};

export const addShowtime = (showtime, onSuccess, onError) => {
    fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapShowtimeToBackendForCreate(showtime)),
    })
        .then(async (response) => {
            if (!response.ok) {
                // Choque de horario (409) u otro error de negocio (400): el backend manda
                // el mensaje tal cual en el body de texto plano. Lo propagamos así, no un
                // "Error al crear la función" genérico, para que el form lo muestre igual.
                const detail = await response.text().catch(() => "");
                throw new Error(detail || "Error al crear la función");
            }
            return response.json();
        })
        .then((data) => onSuccess(mapShowtimeFromBackend(data)))
        .catch((error) => onError(error));
};

export const deleteShowtime = (id, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al eliminar la función");
            onSuccess(id);
        })
        .catch((error) => onError(error));
};

// "2026-08-27T18:00:00" -> "mié 27 ago · 18:00"
export const formatShowtime = (startTime) => {
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime())) return startTime;

    const datePart = date.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
    const timePart = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart}`;
};
