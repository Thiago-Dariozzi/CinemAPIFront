import { request } from "./httpClient";

const mapScreenToBackend = (screen) => ({
    name: screen.name,
    rows: Number(screen.rows) || 0,
    seatsPerRow: Number(screen.seatsPerRow) || 0,
});

export const getAllScreens = () => request("/screen", { errorMessage: "Error al obtener las salas" });

export const getScreenById = (id) => request(`/screen/${id}`, { errorMessage: "Error al obtener la Sala" });

export const addNewScreen = (screen) =>
    request("/screen", { method: "POST", body: mapScreenToBackend(screen), errorMessage: "Error al añadir una sala" });

export const updateScreen = async (id, screen) => {
    const body = mapScreenToBackend(screen);
    await request(`/screen/${id}`, { method: "PUT", body, errorMessage: "Error al actualizar la sala" });
    return { ...body, capacity: body.rows * body.seatsPerRow };
};

export const deleteScreen = (id) =>
    request(`/screen/${id}`, { method: "DELETE", errorMessage: "Error al eliminar la sala" });
