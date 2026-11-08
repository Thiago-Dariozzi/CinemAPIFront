import { parseDateKey, toDateKey } from '../../utils/dates';

export const MAX_RANGE_DAYS = 366;
export const DEFAULT_PRESET_LABEL = "Este mes";

// Adds days to a date
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

// Quick date ranges
export const rangePresets = (today) => [
    { label: "Hoy", from: toDateKey(today), to: toDateKey(today) },
    { label: "Últimos 7 días", from: toDateKey(addDays(today, -6)), to: toDateKey(today) },
    { label: "Este mes", from: toDateKey(new Date(today.getFullYear(), today.getMonth(), 1)), to: toDateKey(today) },
    {
        label: "Mes anterior",
        from: toDateKey(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        to: toDateKey(new Date(today.getFullYear(), today.getMonth(), 0)),
    },
];

// Days in the range, both ends included
const daysCounted = (from, to) => Math.round((parseDateKey(to) - parseDateKey(from)) / (24 * 60 * 60 * 1000)) + 1;

// Checks the range like the backend
export const validateRange = ({ from, to }) => {
    if (!from || !to) return "Elegí las dos fechas.";
    if (from > to) return "La fecha 'desde' no puede ser posterior a la fecha 'hasta'.";
    if (daysCounted(from, to) > MAX_RANGE_DAYS) return `El rango no puede superar los ${MAX_RANGE_DAYS} días.`;
    return null;
};
