import { formatMoney } from '../../utils/money';

const MAX_PERCENTAGE = 100;
const MAX_FIXED_AMOUNT = 1_000_000;
const MAX_NAME_LENGTH = 100;

const hasAtMostTwoDecimals = (value) => /^\d+(\.\d{1,2})?$/.test(String(value).trim());

const validateAmount = (label, max) => (v) => {
    if (String(v).trim() === "") return `${label} es obligatorio (ingresá un número)`;
    const value = Number(v);
    if (!hasAtMostTwoDecimals(v) || value < 0 || value > max) {
        return `${label} debe ser un número entre 0 y ${max.toLocaleString('es-AR')}, con hasta 2 decimales`;
    }
    return null;
};

export const feeFields = [
    {
        key: "name",
        label: "Nombre",
        type: "text",
        placeholder: "Ej: Cargo por servicio",
        validate: (v) => {
            if (v.trim() === "") return "El nombre es obligatorio";
            return v.trim().length > MAX_NAME_LENGTH ? `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres` : null;
        },
    },
    {
        key: "percentage",
        label: "Porcentaje (%)",
        type: "number",
        min: 0,
        step: 0.01,
        group: "amounts",
        placeholder: "Ej: 10",
        coerce: Number,
        validate: validateAmount("El porcentaje", MAX_PERCENTAGE),
    },
    {
        key: "fixedAmount",
        label: "Monto fijo por compra ($)",
        type: "number",
        min: 0,
        step: 0.01,
        group: "amounts",
        placeholder: "Ej: 0",
        coerce: Number,
        validate: validateAmount("El monto fijo", MAX_FIXED_AMOUNT),
    },
    {
        key: "isCurrent",
        label: "Vigente (se aplica a las compras nuevas; desmarca al cargo vigente anterior)",
        type: "checkbox",
    },
];

export const feeConfirmDeleteMessage = "¿Eliminar este cargo? Si es el vigente, las compras nuevas quedan sin cargo.";

export const renderFeeView = ({ name, percentage, fixedAmount, isCurrent }) => (
    <>
        <h2 className="entity-card__title">{name}</h2>
        <div className="entity-card__detail">
            <span>{Number(percentage)} % del subtotal + {formatMoney(fixedAmount)} por compra</span>
        </div>
        <div className={`status-pill ${isCurrent ? 'status-pill--active' : 'status-pill--inactive'}`}>
            {isCurrent ? "✅ Vigente" : "No vigente"}
        </div>
    </>
);
