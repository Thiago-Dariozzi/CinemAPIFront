
const API_BASE = "http://localhost:5288/api/genre";

const mapGenreFromBackend = (genre) => ({
    id: genre.id,
    name: genre.name,
    isActive: genre.isActive,
});

export const getAllGenres = (onSuccess, onError) => {
    fetch(API_BASE, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los géneros");
            return response.json();
        })
        .then((data) => onSuccess(data.map(mapGenreFromBackend)))
        .catch((error) => onError(error));
};

export const addGenre = (genre, onSuccess, onError) => {
    fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ name: genre.name }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const detail = await response.text().catch(() => "");
                throw new Error(detail || "Error al crear el género");
            }
            return response.json();
        })
        .then((data) => onSuccess(mapGenreFromBackend(data)))
        .catch((error) => onError(error));
};

export const updateGenre = (id, genre, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ id, name: genre.name, isActive: true }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const detail = await response.text().catch(() => "");
                throw new Error(detail || "Error al actualizar el género");
            }
            onSuccess({ id, name: genre.name, isActive: true });
        })
        .catch((error) => onError(error));
};

export const deleteGenre = (id, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    })
        .then(async (response) => {
            if (!response.ok) {
                const detail = await response.text().catch(() => "");
                throw new Error(detail || "Error al eliminar el género");
            }
            onSuccess(id);
        })
        .catch((error) => onError(error));
};
