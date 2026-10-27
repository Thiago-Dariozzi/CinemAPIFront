const MAX_ROWS = 26;
const MAX_SEATS_PER_ROW = 40;

const validateRange = (label, max) => (v) => {
    const value = Number(v);
    return Number.isInteger(value) && value >= 1 && value <= max ? null : `${label} debe ser un número entero entre 1 y ${max}`;
};

export const screenFields = [
    {
        key: "name",
        label: "Nombre",
        type: "text",
        placeholder: "Ej: Sala 1, Sala IMAX...",
        validate: (v) => v.trim() === "" ? "El nombre es obligatorio" : null,
    },
    {
        key: "rows",
        label: "Filas (A–Z)",
        type: "number",
        min: 1,
        step: 1,
        group: "layout",
        placeholder: "Cantidad de filas",
        validate: validateRange("La cantidad de filas", MAX_ROWS),
    },
    {
        key: "seatsPerRow",
        label: "Butacas por fila",
        type: "number",
        min: 1,
        step: 1,
        group: "layout",
        placeholder: "Butacas en cada fila",
        validate: validateRange("Las butacas por fila", MAX_SEATS_PER_ROW),
    },
];

export const screenConfirmDeleteMessage = "¿Estás seguro de eliminar esta sala?";

export const renderScreenView = ({ name, rows, seatsPerRow, isActive }) => (
    <>
        <h2 className="entity-card__title">{name}</h2>
        <div className="entity-card__detail">
            <span>{rows} filas × {seatsPerRow} butacas ({rows * seatsPerRow} lugares)</span>
        </div>
        <div className={`status-pill ${isActive ? 'status-pill--active' : 'status-pill--inactive'}`}>
            {isActive ? "✅ Activa" : "❌ Inactiva"}
        </div>
    </>
);
