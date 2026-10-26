import { request } from "./httpClient";

const mapGenreFromBackend = (genre) => ({
    id: genre.id,
    name: genre.name,
    isActive: genre.isActive,
});

export const getAllGenres = async () => {
    const data = await request("/genre", { errorMessage: "Error al obtener los géneros" });
    return data.map(mapGenreFromBackend);
};

export const addGenre = async (genre) => {
    const data = await request("/genre", {
        method: "POST",
        body: { name: genre.name },
        errorMessage: "Error al crear el género",
    });
    return mapGenreFromBackend(data);
};

export const updateGenre = async (id, genre) => {
    await request(`/genre/${id}`, {
        method: "PUT",
        body: { name: genre.name },
        errorMessage: "Error al actualizar el género",
    });
    return { id, name: genre.name, isActive: true };
};

export const deleteGenre = (id) =>
    request(`/genre/${id}`, { method: "DELETE", errorMessage: "Error al eliminar el género" });
