const pad = (value) => String(value).padStart(2, '0');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const toDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateKey = (key) => {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const isDateKey = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const nextDateKeys = (count, from) => Array.from({ length: count }, (_, offset) =>
    toDateKey(new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset)));

const daysBetween = (key, today) =>
    Math.round((parseDateKey(key) - parseDateKey(toDateKey(today))) / MS_PER_DAY);

export const dayChipLabel = (key, today) => {
    const date = parseDateKey(key);
    const offset = daysBetween(key, today);
    const name = offset === 0 ? 'Hoy' : offset === 1 ? 'Mañana' : date.toLocaleDateString('es-AR', { weekday: 'short' });
    return { name, date: date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) };
};

export const formatLongDate = (key) =>
    parseDateKey(key).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

export const formatReleaseDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? null
        : date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatTime = (value) =>
    new Date(value).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (hours === 0) return `${rest} min`;
    return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
};
