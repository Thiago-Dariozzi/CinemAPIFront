import { request } from "./httpClient";

const mapScreenToBackend = (screen) => ({
    name: screen.name,
    capacity: Number(screen.capacity) || 0,
});

export const getAllScreens = () => request("/screen", { errorMessage: "Error al obtener las salas" });

export const getScreenById = (id) => request(`/screen/${id}`, { errorMessage: "Error al obtener la Sala" });

export const addNewScreen = (screen) =>
    request("/screen", { method: "POST", body: mapScreenToBackend(screen), errorMessage: "Error al añadir una sala" });

export const updateScreen = async (id, screen) => {
    await request(`/screen/${id}`, { method: "PUT", body: mapScreenToBackend(screen), errorMessage: "Error al actualizar la sala" });
};

export const deleteScreen = (id) =>
    request(`/screen/${id}`, { method: "DELETE", errorMessage: "Error al eliminar la sala" });
