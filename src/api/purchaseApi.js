import { request } from "./httpClient";

const toQueryString = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });
    const query = params.toString();
    return query ? `?${query}` : "";
};

export const createPurchase = ({ showtimeId, seats }) =>
    request("/purchase", {
        method: "POST",
        body: { showtimeId, seats: seats.map(({ row, number }) => ({ row, number })) },
        errorMessage: "No se pudo confirmar la compra",
    });

export const getMyPurchases = () => request("/purchase/mine", { errorMessage: "Error al obtener tus compras" });

export const getPurchases = (filters = {}) =>
    request(`/purchase${toQueryString(filters)}`, { errorMessage: "Error al obtener las ventas" });

export const cancelPurchase = (id) =>
    request(`/purchase/${id}/cancel`, { method: "POST", errorMessage: "No se pudo cancelar la compra" });
