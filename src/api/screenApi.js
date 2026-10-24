const API_BASE = "http://localhost:5288/api/screen";

const mapScreenToBackend = (screen) => ({
    name: screen.name,
    capacity: Number(screen.capacity) || 0,
});

export const getAllScreens = async () => {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Error al obtener las salas");
    return await response.json();
};

export const getScreenById = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error("Error al obtener la Sala");
    return await response.json();
};

export const addNewScreen = async (screen) => {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapScreenToBackend(screen)),
    });
    if (!response.ok) throw new Error("Error al añadir una sala");
    return await response.json();
};

export const updateScreen = async (id, screen) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapScreenToBackend(screen)),
    });
    if (!response.ok) throw new Error("Error al actualizar la sala");
};

export const deleteScreen = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la sala");
};
