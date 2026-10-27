const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 100;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 150;

const nameField = {
    key: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Nombre completo",
    group: "identity",
    validate: (v) => {
        if (v.trim() === "") return "El nombre es obligatorio";
        return v.trim().length > MAX_NAME_LENGTH ? `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres` : null;
    },
};

const emailField = {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "correo@ejemplo.com",
    group: "identity",
    autoComplete: "off",
    validate: (v) => {
        if (!EMAIL_PATTERN.test(v.trim())) return "Ingresá un email válido";
        return v.trim().length > MAX_EMAIL_LENGTH ? `El email no puede superar los ${MAX_EMAIL_LENGTH} caracteres` : null;
    },
};

const passwordField = {
    key: "password",
    label: "Contraseña inicial",
    type: "password",
    placeholder: `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`,
    autoComplete: "new-password",
    validate: (v) => (v.length >= MIN_PASSWORD_LENGTH && v.length <= MAX_PASSWORD_LENGTH
        ? null
        : `La contraseña debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres`),
};

export const createUserFields = [nameField, emailField, passwordField];

export const editUserFields = [nameField, emailField];

export const userConfirmDeleteMessage = "¿Dar de baja a este usuario? No va a poder entrar hasta que lo reactives.";

export const renderUserView = ({ name, email, isActive }) => (
    <>
        <h2 className="entity-card__title">👤 {name}</h2>
        <div className="entity-card__detail">
            <span>{email}</span>
        </div>
        <div className={`status-pill ${isActive ? 'status-pill--active' : 'status-pill--inactive'}`}>
            {isActive ? "✅ Activo" : "❌ Dado de baja"}
        </div>
    </>
);
