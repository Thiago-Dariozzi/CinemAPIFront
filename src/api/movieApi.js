import { request } from "./httpClient";

const mapMovieToBackend = (movie) => ({
    title: movie.title,
    synopsis: movie.synopsis,
    durationMinutes: Number(movie.durationMinutes) || 0,
    genreId: movie.genreId,
    imageUrl: movie.imageUrl,
    releaseDate: movie.releaseDate,
    suggestedPrice: movie.suggestedPrice === "" || movie.suggestedPrice == null ? null : Number(movie.suggestedPrice),
    isShowing: movie.isShowing ?? true,
});

export const getAllMovies = () => request("/movie", { errorMessage: "Error al obtener películas" });

export const getMovieById = (id) => request(`/movie/${id}`, { errorMessage: "Error al obtener la película" });

export const getActiveMovies = () => request("/movie/active", { errorMessage: "Error al obtener películas activas" });

export const addMovie = (movie) =>
    request("/movie", { method: "POST", body: mapMovieToBackend(movie), errorMessage: "Error al crear la película" });

export const updateMovie = async (id, movie) => {
    await request(`/movie/${id}`, { method: "PUT", body: mapMovieToBackend(movie), errorMessage: "Error al actualizar la película" });
};

export const deleteMovie = (id) =>
    request(`/movie/${id}`, { method: "DELETE", errorMessage: "Error al eliminar la película" });
