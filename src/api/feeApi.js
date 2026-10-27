import { request } from "./httpClient";

export const getCurrentFee = () => request("/fee/current", { errorMessage: "Error al obtener el cargo por servicio" });
