// session.js
// Login MUY simple para esta etapa del proyecto: sin JWT, sin hash de nuestro lado.
// Dos cuentas hardcodeadas para poder navegar el panel de Admin y el panel de Usuario.
// Cuando el backend tenga auth real, esto se reemplaza por llamadas a AuthApi.js sin
// tocar el resto de la app (Login/ProtectedRoute solo dependen de getSession()/login()/logout()).
import { getUserByEmail, addUser } from '../api/UsersApi/UserApi';

const SESSION_KEY = "cinemapi_session";

const ACCOUNTS = [
    { email: "admin@admin.com", password: "admin", role: "Admin" },
    { email: "user@user.com", password: "user", role: "Client" },
];

// El panel de Usuario necesita filtrar "mis tickets" por userId real de la base, así que
// la cuenta demo de Client tiene que corresponder a un User real. Si todavía no existe
// (el DbSeeder no lo crea), lo damos de alta la primera vez que alguien entra con ella.
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
        // Admin administra todo, no algo "propio": no necesita un User real en la base.
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
