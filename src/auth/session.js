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

const saveSession = (email, role, userId) => {
    const session = { email, role, userId: userId ?? null };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
};

export const login = async (email, password) => {
    const account = ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
    );

    if (!account) {
        throw new Error("Email o contraseña incorrectos.");
    }

    if (account.role !== "Client") {
        return saveSession(account.email, account.role, null);
    }

    try {
        const user = await getUserByEmail(account.email);
        return saveSession(account.email, account.role, user.id);
    } catch {
        const created = await addUser(DEMO_CLIENT_PROFILE);
        return saveSession(account.email, account.role, created.id);
    }
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
