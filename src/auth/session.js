import { login as loginRequest, register as registerRequest } from '../api/authApi';
import { configureHttpClient } from '../api/httpClient';

const SESSION_KEY = "cinemapi_session";
const listeners = new Set();

let cachedRaw;
let cachedSession = null;
let expiredNotice = false;

const readStorage = () => {
    try {
        return localStorage.getItem(SESSION_KEY);
    } catch {
        return null;
    }
};

const parseSession = (raw) => {
    if (!raw) return null;
    try {
        const session = JSON.parse(raw);
        return session?.token ? session : null;
    } catch {
        return null;
    }
};

const notify = () => listeners.forEach((listener) => listener());

const writeSession = (session) => {
    try {
        if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        else localStorage.removeItem(SESSION_KEY);
    } catch {
        // Storage blocked (private mode): the session cannot persist, listeners still update.
    }
    notify();
};

const startSession = ({ token, expiresAt, user }) => {
    expiredNotice = false;
    const session = { token, expiresAt, userId: user.id, name: user.name, email: user.email, role: user.role };
    writeSession(session);
    return session;
};

export const getSession = () => {
    const raw = readStorage();
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedSession = parseSession(raw);
    }
    if (cachedSession && new Date(cachedSession.expiresAt) <= new Date()) return null;
    return cachedSession;
};

export const subscribe = (listener) => {
    listeners.add(listener);
    const onStorage = (event) => {
        if (event.key === SESSION_KEY) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
};

export const login = async (credentials) => startSession(await loginRequest(credentials));

export const register = async (account) => startSession(await registerRequest(account));

export const logout = () => writeSession(null);

export const updateSessionName = (name) => {
    const session = getSession();
    if (session) writeSession({ ...session, name });
};

export const isSessionExpiredNotice = () => expiredNotice;

configureHttpClient({
    tokenProvider: () => getSession()?.token ?? null,
    unauthorizedHandler: () => {
        expiredNotice = true;
        logout();
    },
});
