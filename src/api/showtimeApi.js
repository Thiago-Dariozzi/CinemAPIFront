const API_BASE = "http://localhost:5288/api/showtime";

const mapShowtimeFromBackend = (showtime) => ({
    id: showtime.id,
    movieId: showtime.movieId,
    screenId: showtime.screenId,
    startTime: showtime.startTime,
    price: showtime.price,
});

const mapShowtimeToBackendForCreate = (showtime) => ({
    movieId: showtime.movieId,
    screenId: showtime.screenId,
    startTime: showtime.startTime,
    price: Number(showtime.price) || 0,
});

export const getShowtimesByMovie = async (movieId) => {
    const response = await fetch(`${API_BASE}/movie/${movieId}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener los horarios");
    const data = await response.json();
    return data.map(mapShowtimeFromBackend);
};

export const getOccupiedShowtimesByScreen = async (screenId, date) => {
    const response = await fetch(`${API_BASE}/screen/${screenId}?date=${date}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener la ocupación de la sala");
    const data = await response.json();
    return data.map(mapShowtimeFromBackend);
};

export const addShowtime = async (showtime) => {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapShowtimeToBackendForCreate(showtime)),
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(detail || "Error al crear la función");
    }
    const data = await response.json();
    return mapShowtimeFromBackend(data);
};

export const deleteShowtime = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la función");
};

export const formatShowtime = (startTime) => {
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime())) return startTime;

    const datePart = date.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
    const timePart = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart}`;
};
