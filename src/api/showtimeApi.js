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

export const formatShowtime = (startTime) => {
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime())) return startTime;

    const datePart = date.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
    const timePart = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart}`;
};
