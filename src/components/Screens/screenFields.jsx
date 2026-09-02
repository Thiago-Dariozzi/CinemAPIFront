import React from 'react';

export const screenFields = [
    {
        key: "name",
        label: "Nombre",
        type: "text",
        placeholder: "Ej: Sala 1, Sala IMAX...",
        validate: (v) => v.trim() === "" ? "El nombre es obligatorio" : null,
    },
    {
        key: "capacity",
        label: "Capacidad",
        type: "number",
        size: "lg",
        placeholder: "Cantidad de asientos",
        validate: (v) => Number(v) <= 0 ? "La capacidad debe ser mayor a 0" : null,
    },
];

export const screenConfirmDeleteMessage = "¿Estás seguro de eliminar esta sala?";

export const renderScreenView = ({ name, capacity, isActive }) => (
    <>
        <h2 className="entity-card__title">{name}</h2>
        <div className="entity-card__detail">
            <span>Capacidad: {capacity}</span>
        </div>
        <div className={`status-pill ${isActive ? 'status-pill--active' : 'status-pill--inactive'}`}>
            {isActive ? "✅ Activa" : "❌ Inactiva"}
        </div>
    </>
);
