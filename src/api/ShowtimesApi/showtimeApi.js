// showtimeApi.js
// Fetch de la entidad Showtime (horario/función): por ahora el front solo necesita
// consultarlos por película, para armar el combo "Horario" del panel de Usuario.

const API_BASE = "http://localhost:5288/api/showtime";

const mapShowtimeFromBackend = (showtime) => ({
    id: showtime.id,
    movieId: showtime.movieId,
    screenId: showtime.screenId,
    startTime: showtime.startTime,
    price: showtime.price,
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

// "2026-08-27T18:00:00" -> "mié 27 ago · 18:00"
export const formatShowtime = (startTime) => {
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime())) return startTime;

    const datePart = date.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
    const timePart = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart}`;
};
