const MAX_NAME_LENGTH = 50;

export const genreFields = [
    {
        key: "name",
        label: "Nombre",
        type: "text",
        placeholder: "Ej: Acción, Comedia...",
        validate: (v) => {
            if (v.trim() === "") return "El nombre es obligatorio";
            return v.trim().length > MAX_NAME_LENGTH ? `El nombre no puede superar los ${MAX_NAME_LENGTH} caracteres` : null;
        },
    },
];

export const genreConfirmDeleteMessage = (name) => `¿Eliminar el género "${name}"?`;

export const renderGenreView = ({ name, movieCount }) => (
    <>
        <h2 className="entity-card__title">{name}</h2>
        <div className="entity-card__detail">
            <span>🎬 {movieCount} película{movieCount === 1 ? "" : "s"}</span>
        </div>
    </>
);
