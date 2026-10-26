import { request } from "./httpClient";

const mapUserFromBackend = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
});

const mapUserToBackendForCreate = (user) => ({
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
});

const mapUserToBackendForUpdate = (user) => ({
    name: user.name,
    email: user.email,
    role: user.role,
});

export const getAllUsers = async () => {
    const data = await request("/user", { errorMessage: "Error al obtener los usuarios" });
    return data.map(mapUserFromBackend);
};

export const getUserById = async (id) => {
    const data = await request(`/user/${id}`, { errorMessage: "Error al obtener el usuario" });
    return mapUserFromBackend(data);
};

export const getUserByEmail = async (email) => {
    const data = await request(`/user/email/${encodeURIComponent(email)}`, { errorMessage: "Error al obtener el usuario por email" });
    return mapUserFromBackend(data);
};

export const addUser = async (user) => {
    const data = await request("/user", {
        method: "POST",
        body: mapUserToBackendForCreate(user),
        errorMessage: "Error al crear el usuario",
    });
    return mapUserFromBackend(data);
};

export const updateUser = async (id, user) => {
    await request(`/user/${id}`, {
        method: "PUT",
        body: mapUserToBackendForUpdate(user),
        errorMessage: "Error al actualizar el usuario",
    });
    return { id, name: user.name, email: user.email, role: user.role, isActive: true };
};

export const deleteUser = (id) =>
    request(`/user/${id}`, { method: "DELETE", errorMessage: "Error al eliminar el usuario" });
