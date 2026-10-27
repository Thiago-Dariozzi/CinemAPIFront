import { request } from "./httpClient";

const mapAuthFromBackend = (auth) => ({
    token: auth.token,
    expiresAt: auth.expiresAt,
    user: {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role,
    },
});

export const login = async ({ email, password }) => {
    const data = await request("/auth/login", {
        method: "POST",
        body: { email: email.trim(), password },
        errorMessage: "No se pudo iniciar sesión",
        anonymous: true,
    });
    return mapAuthFromBackend(data);
};

export const register = async ({ name, email, password }) => {
    const data = await request("/auth/register", {
        method: "POST",
        body: { name: name.trim(), email: email.trim(), password },
        errorMessage: "No se pudo crear la cuenta",
        anonymous: true,
    });
    return mapAuthFromBackend(data);
};

export const updateProfile = ({ name }) =>
    request("/auth/me", { method: "PUT", body: { name: name.trim() }, errorMessage: "No se pudo actualizar el perfil" });

export const changePassword = ({ currentPassword, newPassword }) =>
    request("/auth/password", {
        method: "PUT",
        body: { currentPassword, newPassword },
        errorMessage: "No se pudo cambiar la contraseña",
    });
