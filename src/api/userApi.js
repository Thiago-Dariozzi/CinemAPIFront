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

export const getAllUsers = async (role, search = "") => {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (search.trim()) params.append("search", search.trim());
    const query = params.toString() ? `?${params}` : "";
    const data = await request(`/user${query}`, { errorMessage: "Error al obtener los usuarios" });
    return data.map(mapUserFromBackend);
};

export const getUserById = async (id) => {
    const data = await request(`/user/${id}`, { errorMessage: "Error al obtener el usuario" });
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
    request(`/user/${id}`, { method: "DELETE", errorMessage: "Error al dar de baja el usuario" });

export const reactivateUser = (id) =>
    request(`/user/${id}/reactivate`, { method: "POST", errorMessage: "Error al reactivar el usuario" });
