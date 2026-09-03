const API_BASE = "http://localhost:5288/api/genre";

const mapGenreFromBackend = (genre) => ({
    id: genre.id,
    name: genre.name,
    isActive: genre.isActive,
});

export const getAllGenres = async () => {
    const response = await fetch(API_BASE, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener los géneros");
    const data = await response.json();
    return data.map(mapGenreFromBackend);
};

export const addGenre = async (genre) => {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ name: genre.name }),
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(detail || "Error al crear el género");
    }
    const data = await response.json();
    return mapGenreFromBackend(data);
};

export const updateGenre = async (id, genre) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ id, name: genre.name, isActive: true }),
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(detail || "Error al actualizar el género");
    }
    return { id, name: genre.name, isActive: true };
};

export const deleteGenre = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(detail || "Error al eliminar el género");
    }
};
