import React from 'react';

export const genreFields = [
    {
        key: "name",
        label: "Nombre",
        type: "text",
        placeholder: "Ej: Acción, Comedia...",
        validate: (v) => v.trim() === "" ? "El nombre es obligatorio" : null,
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
