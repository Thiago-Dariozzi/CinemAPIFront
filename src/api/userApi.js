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

export const getAllUsers = (onSuccess, onError) => {
    fetch(API_BASE, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los usuarios");
            return response.json();
        })
        .then((data) => onSuccess(data.map(mapUserFromBackend)))
        .catch((error) => onError(error));
};

export const getUserById = (id, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener el usuario");
            return response.json();
        })
        .then((data) => onSuccess(mapUserFromBackend(data)))
        .catch((error) => onError(error));
};

export const getUserByEmail = (email, onSuccess, onError) => {
    fetch(`${API_BASE}/email/${email}`, {
        headers: { "Accept": "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener el usuario por email");
            return response.json();
        })
        .then((data) => onSuccess(mapUserFromBackend(data)))
        .catch((error) => onError(error));
};

export const addUser = (user, onSuccess, onError) => {
    fetch(API_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapUserToBackendForCreate(user)),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al crear el usuario");
            return response.json();
        })
        .then((data) => onSuccess(mapUserFromBackend(data)))
        .catch((error) => onError(error));
};

export const updateUser = (id, user, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(mapUserToBackendForUpdate(id, user)),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al actualizar el usuario");
            onSuccess({ id, name: user.name, email: user.email, role: user.role, isActive: true });
        })
        .catch((error) => onError(error));
};

export const deleteUser = (id, onSuccess, onError) => {
    fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al eliminar el usuario");
            onSuccess(id);
        })
        .catch((error) => onError(error));
};
