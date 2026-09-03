const API_BASE = "http://localhost:5288/api/user";

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

const mapUserToBackendForUpdate = (id, user) => ({
    id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    isActive: true,
});

export const getAllUsers = async () => {
    const response = await fetch(API_BASE, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener los usuarios");
    const data = await response.json();
    return data.map(mapUserFromBackend);
};

export const getUserById = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener el usuario");
    const data = await response.json();
    return mapUserFromBackend(data);
};

export const getUserByEmail = async (email) => {
    const response = await fetch(`${API_BASE}/email/${email}`, {
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener el usuario por email");
    const data = await response.json();
    return mapUserFromBackend(data);
};

export const addUser = async (user) => {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapUserToBackendForCreate(user)),
    });
    if (!response.ok) throw new Error("Error al crear el usuario");
    const data = await response.json();
    return mapUserFromBackend(data);
};

export const updateUser = async (id, user) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapUserToBackendForUpdate(id, user)),
    });
    if (!response.ok) throw new Error("Error al actualizar el usuario");
    return { id, name: user.name, email: user.email, role: user.role, isActive: true };
};

export const deleteUser = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el usuario");
};
