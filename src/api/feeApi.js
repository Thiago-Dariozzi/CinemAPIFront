import { request } from "./httpClient";

const mapFeeFromBackend = (fee) => ({
    id: fee.id,
    name: fee.name,
    percentage: fee.percentage,
    fixedAmount: fee.fixedAmount,
    isCurrent: fee.isCurrent,
});

const mapFeeToBackend = (fee) => ({
    name: fee.name,
    percentage: Number(fee.percentage),
    fixedAmount: Number(fee.fixedAmount),
    isCurrent: Boolean(fee.isCurrent),
});

export const getCurrentFee = async () => {
    const data = await request("/fee/current", { errorMessage: "Error al obtener el cargo por servicio" });
    return data ? mapFeeFromBackend(data) : null;
};

export const getAllFees = async () => {
    const data = await request("/fee", { errorMessage: "Error al obtener los cargos" });
    return data.map(mapFeeFromBackend);
};

export const addFee = async (fee) => {
    const data = await request("/fee", { method: "POST", body: mapFeeToBackend(fee), errorMessage: "Error al crear el cargo" });
    return mapFeeFromBackend(data);
};

export const updateFee = async (id, fee) => {
    const body = mapFeeToBackend(fee);
    await request(`/fee/${id}`, { method: "PUT", body, errorMessage: "Error al actualizar el cargo" });
    return body;
};

export const deleteFee = (id) =>
    request(`/fee/${id}`, { method: "DELETE", errorMessage: "Error al eliminar el cargo" });
