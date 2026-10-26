import { readApiError } from "./apiError";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5288/api";

export const request = async (path, { method = "GET", body, errorMessage = "Error de comunicación con el servidor" } = {}) => {
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                Accept: "application/json",
                ...(body !== undefined && { "Content-Type": "application/json" }),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch (networkError) {
        throw new Error(errorMessage, { cause: networkError });
    }
    if (!response.ok) throw new Error(await readApiError(response, errorMessage));
    return response.status === 204 ? null : response.json();
};
