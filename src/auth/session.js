import { login as loginRequest, register as registerRequest } from '../api/authApi';
import { configureHttpClient } from '../api/httpClient';
import { ROLES } from './roles';

const SESSION_KEY = "cinemapi_session";
const listeners = new Set();

let cachedRaw;
let cachedSession = null;
let expiredNotice = false;
let expiryTimer;

const KNOWN_ROLES = Object.values(ROLES);

// Reads the raw session from storage
const readStorage = () => {
    try {
        return localStorage.getItem(SESSION_KEY);
    } catch {
        return null;
    }
};

// Parses and validates the stored session
const parseSession = (raw) => {
    if (!raw) return null;
    try {
        const session = JSON.parse(raw);
        return session?.token && KNOWN_ROLES.includes(session.role) ? session : null;
    } catch {
        return null;
    }
};

// Tells subscribers the session changed
const notify = () => listeners.forEach((listener) => listener());

// Logs out and flags the expired notice
const expireSession = () => {
    expiredNotice = true;
    logout();
};

// Sets a timer to log out at expiry
const scheduleExpiry = () => {
    clearTimeout(expiryTimer);
    const session = getSession();
    if (session) expiryTimer = setTimeout(expireSession, Math.max(new Date(session.expiresAt) - Date.now(), 0));
};

// Saves or clears the session and notifies
const writeSession = (session) => {
    try {
        if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        else localStorage.removeItem(SESSION_KEY);
    } catch {
        // Storage blocked (private mode): the session cannot persist, listeners still update.
    }
    scheduleExpiry();
    notify();
};

// Builds and saves the session from the login response
const startSession = ({ token, expiresAt, user }) => {
    expiredNotice = false;
    const session = { token, expiresAt, userId: user.id, name: user.name, email: user.email, role: user.role };
    writeSession(session);
    return session;
};

// Returns the cached session, or null if expired
export const getSession = () => {
    const raw = readStorage();
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedSession = parseSession(raw);
    }
    if (cachedSession && new Date(cachedSession.expiresAt) <= new Date()) return null;
    return cachedSession;
};

// Listens to session changes, also from other tabs
export const subscribe = (listener) => {
    listeners.add(listener);
    const onStorage = (event) => {
        if (event.key === SESSION_KEY || event.key === null) listener();
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

// Updates the name in the saved session
export const updateSessionName = (name) => {
    const session = getSession();
    if (session) writeSession({ ...session, name });
};

export const isSessionExpiredNotice = () => expiredNotice;

configureHttpClient({
    tokenProvider: () => getSession()?.token ?? null,
    unauthorizedHandler: expireSession,
});

scheduleExpiry();
