import React, { useState } from 'react';

const ScreenCard = ({
    id,
    name,
    capacity,
    isActive,
    onDelete,
    onEdit
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name, capacity });

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    };

    const handleSave = () => {
        onEdit(id, { ...form, id, isActive });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="entity-card">
                <label>Nombre</label>
                <input className="form-input form-input--compact" value={form.name} onChange={(e) => handleChangeValue(e, "name")} />

                <label>Capacidad</label>
                <input className="form-input form-input--compact" type="number" value={form.capacity} onChange={(e) => handleChangeValue(e, "capacity")} />

                <button
                    onClick={handleSave}
                    className="btn btn--save btn-group"
                >
                    Guardar
                </button>
                <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn--cancel btn-group"
                >
                    Cancelar
                </button>
            </div>
        );
    }

    return (
        <div className="entity-card">
            <h2 className="entity-card__title">{name}</h2>

            <div className="entity-card__detail">
                <span> Capacidad: {capacity}</span>
            </div>

            <div className={`status-pill ${isActive ? 'status-pill--active' : 'status-pill--inactive'}`}>
                {isActive ? "✅ Activa" : "❌ Inactiva"}
            </div>

            {onEdit && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn--primary btn-group"
                >
                    Editar
                </button>
            )}

            {onDelete && (
                <button
                    onClick={() => {if (window.confirm("¿Estás seguro de eliminar esta sala?"))
                         onDelete(id)}}
                    className="btn btn--delete btn-group"
                >
                    Eliminar
                </button>
            )}
        </div>
    );
};

export default ScreenCard;
