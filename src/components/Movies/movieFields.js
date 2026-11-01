const MAX_TITLE_LENGTH = 150;
const MAX_SYNOPSIS_LENGTH = 5000;
const MAX_IMAGE_URL_LENGTH = 500;
const MAX_DURATION_MINUTES = 1000;
const MIN_RELEASE_DATE = "1900-01-01";
const IMAGE_URL_PATTERN = /^https?:\/\/\S+$/i;

export const movieFormFields = [
    {
        key: "title",
        label: "Título",
        type: "text",
        placeholder: "Ingresar título",
        validate: (v) => {
            if (v.trim() === "") return "El título es obligatorio";
            return v.trim().length > MAX_TITLE_LENGTH ? `El título no puede superar los ${MAX_TITLE_LENGTH} caracteres` : null;
        },
    },
    {
        key: "genreId",
        label: "Género",
        type: "select",
        placeholder: "Seleccionar género...",
        optionsFrom: "genres",
        validate: (v) => !v ? "Elegí un género" : null,
    },
    {
        key: "synopsis",
        label: "Sinopsis",
        type: "text",
        placeholder: "Breve resumen",
        validate: (v) => (v ?? "").length > MAX_SYNOPSIS_LENGTH ? `La sinopsis no puede superar los ${MAX_SYNOPSIS_LENGTH} caracteres` : null,
    },
    {
        key: "imageUrl",
        label: "URL Imagen",
        type: "text",
        group: "imageDuration",
        placeholder: "https://...",
        validate: (v) => {
            const value = (v ?? "").trim();
            if (value === "") return null;
            if (!IMAGE_URL_PATTERN.test(value)) return "La URL tiene que empezar con http:// o https://";
            return value.length > MAX_IMAGE_URL_LENGTH ? `La URL no puede superar los ${MAX_IMAGE_URL_LENGTH} caracteres` : null;
        },
    },
    {
        key: "durationMinutes",
        label: "Minutos",
        type: "number",
        group: "imageDuration",
        compact: true,
        validate: (v) => {
            const value = Number(v);
            return Number.isInteger(value) && value >= 1 && value <= MAX_DURATION_MINUTES
                ? null
                : `La duración debe ser un número entero entre 1 y ${MAX_DURATION_MINUTES}`;
        },
    },
    {
        key: "releaseDate",
        label: "Fecha de estreno",
        type: "date",
        validate: (v) => {
            if (!v) return "La fecha de estreno es obligatoria";
            return v < MIN_RELEASE_DATE ? "Ingresá una fecha de estreno válida" : null;
        },
    },
    {
        key: "suggestedPrice",
        label: "Precio sugerido (opcional)",
        type: "number",
        size: "lg",
        min: 0,
        step: 0.01,
        placeholder: "Precio de referencia para precargar sus funciones",
        omitIfEmpty: true,
        coerce: Number,
        validate: (v) => v !== "" && Number(v) < 0 ? "El precio sugerido no puede ser negativo" : null,
    },
    {
        key: "isShowing",
        label: "¿Está en cartelera disponible?",
        type: "checkbox",
    },
];
