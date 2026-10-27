import { request } from "./httpClient";

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
    const data = await request(`/showtime/movie/${movieId}`, { errorMessage: "Error al obtener los horarios" });
    return data.map(mapShowtimeFromBackend);
};

export const getOccupiedShowtimesByScreen = async (screenId, date) => {
    const data = await request(`/showtime/screen/${screenId}?date=${encodeURIComponent(date)}`, {
        errorMessage: "Error al obtener la ocupación de la sala",
    });
    return data.map(mapShowtimeFromBackend);
};

export const addShowtime = async (showtime) => {
    const data = await request("/showtime", {
        method: "POST",
        body: mapShowtimeToBackendForCreate(showtime),
        errorMessage: "Error al crear la función",
    });
    return mapShowtimeFromBackend(data);
};

export const deleteShowtime = (id) =>
    request(`/showtime/${id}`, { method: "DELETE", errorMessage: "Error al eliminar la función" });

export const getUpcomingShowtimes = async (movieId) => {
    const query = movieId ? `?movieId=${encodeURIComponent(movieId)}` : "";
    const data = await request(`/showtime/upcoming${query}`, { errorMessage: "Error al obtener las próximas funciones" });
    return data.map(mapShowtimeFromBackend);
};

export const getSeatMap = (showtimeId) =>
    request(`/showtime/${showtimeId}/seats`, { errorMessage: "Error al obtener el mapa de butacas" });
