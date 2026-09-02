const API_BASE = "http://localhost:5288/api/movie";

export const getAllMovies = async () => {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Error al obtener películas");
    return await response.json();
};

export const getMovieById = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error("Error al obtener la película");
    return await response.json();
};

export const getActiveMovies = async () => {
    const response = await fetch(`${API_BASE}/active`);
    if (!response.ok) throw new Error("Error al obtener películas activas");
    return await response.json();
};

export const addMovie = async (movie) => {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
    });
    if (!response.ok) throw new Error("Error al crear la película");
    return await response.json();
};

export const updateMovie = async (id, movie) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
    });
    if (!response.ok) throw new Error("Error al actualizar la película");
};

export const deleteMovie = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Error al eliminar la película (status ${response.status})${detail ? `: ${detail}` : ""}`);
    }
};