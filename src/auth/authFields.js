const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const required = (message) => (value) => (value.trim() === "" ? message : null);

const validateEmail = (value) => {
    if (value.trim() === "") return "El email es obligatorio";
    return EMAIL_PATTERN.test(value.trim()) ? null : "El email no tiene un formato válido";
};

const validateNewPassword = (value) =>
    value.length < MIN_PASSWORD_LENGTH ? `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` : null;

const nameField = {
    key: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Nombre y apellido",
    autoComplete: "name",
    validate: required("El nombre es obligatorio"),
};

export const loginFields = [
    { key: "email", label: "Email", type: "email", placeholder: "correo@ejemplo.com", autoComplete: "username", validate: validateEmail },
    { key: "password", label: "Contraseña", type: "password", autoComplete: "current-password", validate: required("La contraseña es obligatoria") },
];

export const registerFields = [
    nameField,
    { key: "email", label: "Email", type: "email", placeholder: "correo@ejemplo.com", autoComplete: "email", validate: validateEmail },
    { key: "password", label: "Contraseña", type: "password", autoComplete: "new-password", validate: validateNewPassword },
    {
        key: "confirmPassword",
        label: "Repetir contraseña",
        type: "password",
        autoComplete: "new-password",
        validate: (value, form) => (value !== form.password ? "Las contraseñas no coinciden" : null),
    },
];

export const profileFields = [nameField];

export const changePasswordFields = [
    {
        key: "currentPassword",
        label: "Contraseña actual",
        type: "password",
        autoComplete: "current-password",
        validate: required("La contraseña actual es obligatoria"),
    },
    { key: "newPassword", label: "Contraseña nueva", type: "password", autoComplete: "new-password", validate: validateNewPassword },
    {
        key: "confirmPassword",
        label: "Repetir contraseña nueva",
        type: "password",
        autoComplete: "new-password",
        validate: (value, form) => (value !== form.newPassword ? "Las contraseñas no coinciden" : null),
    },
];
