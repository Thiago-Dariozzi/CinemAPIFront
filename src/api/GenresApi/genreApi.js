// genreApi.js
// Fetch de la entidad Genre: Id, Name, IsActive. Movie ya no guarda el género como texto
// libre, guarda GenreId (FK) — este cliente es lo que puebla el desplegable de género en
// NewMovie.jsx/MovieCard.jsx y resuelve el nombre a partir del id donde haga falta
// mostrarlo. Mismo patrón callback (onSuccess/onError) que showtimeApi.js.

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
                // Nombre duplicado (409): el backend manda el mensaje tal cual en el body
                // de texto plano ("Ya existe un género equivalente: 'Acción' ..."). Lo
                // propagamos así, no un "Error al crear el género" genérico.
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
        // Si no mandamos isActive, System.Text.Json lo deserializa en false y el género
        // "desaparece" (soft-delete accidental). Como solo se edita un género que ya
        // está activo en la lista, mandamos isActive: true siempre.
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
                // Género en uso (409): idem arriba, mensaje tal cual del backend
                // ("No se puede eliminar el género 'Comedia': tiene 4 película(s)...").
                const detail = await response.text().catch(() => "");
                throw new Error(detail || "Error al eliminar el género");
            }
            onSuccess(id);
        })
        .catch((error) => onError(error));
};
