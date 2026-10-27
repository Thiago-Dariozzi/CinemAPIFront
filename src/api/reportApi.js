import { request } from "./httpClient";

export const getSalesReport = ({ from, to }) => {
    const params = new URLSearchParams({ from, to });
    return request(`/reports/sales?${params}`, { errorMessage: "Error al obtener el reporte de ventas" });
};

export const getOccupancyReport = (date) => {
    const params = new URLSearchParams({ date });
    return request(`/reports/occupancy?${params}`, { errorMessage: "Error al obtener el reporte de ocupación" });
};
