import { getUserByEmail, addUser } from '../api/userApi';

const SESSION_KEY = "cinemapi_session";

const ACCOUNTS = [
    { email: "admin@admin.com", password: "admin", role: "Admin" },
    { email: "user@user.com", password: "user", role: "Client" },
];

const DEMO_CLIENT_PROFILE = {
    name: "Usuario Demo",
    email: "user@user.com",
    password: "user",
    role: "Client",
};

const saveSession = (email, role, userId, onSuccess) => {
    const session = { email, role, userId: userId ?? null };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    onSuccess(session);
};

export const login = (email, password, onSuccess, onError) => {
    const account = ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
    );

    if (!account) {
        onError(new Error("Email o contraseña incorrectos."));
        return;
    }

    if (account.role !== "Client") {
        saveSession(account.email, account.role, null, onSuccess);
        return;
    }

    getUserByEmail(
        account.email,
        (user) => saveSession(account.email, account.role, user.id, onSuccess),
        () => {
            addUser(
                DEMO_CLIENT_PROFILE,
                (created) => saveSession(account.email, account.role, created.id, onSuccess),
                (err) => onError(err)
            );
        }
    );
};

export const logout = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const getSession = () => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};
