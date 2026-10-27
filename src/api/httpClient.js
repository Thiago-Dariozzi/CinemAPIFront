import { readApiError } from "./apiError";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5288/api";

let getToken = () => null;
let onUnauthorized = () => {};

export const configureHttpClient = ({ tokenProvider, unauthorizedHandler }) => {
    getToken = tokenProvider;
    onUnauthorized = unauthorizedHandler;
};

export const request = async (path, { method = "GET", body, errorMessage = "Error de comunicación con el servidor", anonymous = false } = {}) => {
    const token = getToken();
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                Accept: "application/json",
                ...(body !== undefined && { "Content-Type": "application/json" }),
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch (networkError) {
        throw new Error(errorMessage, { cause: networkError });
    }
    if (response.status === 401 && !anonymous) onUnauthorized();
    if (!response.ok) {
        const error = new Error(await readApiError(response, errorMessage));
        error.status = response.status;
        throw error;
    }
    return response.status === 204 ? null : response.json();
};
