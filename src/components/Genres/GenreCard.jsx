import React, { useState } from 'react';
import { updateGenre, deleteGenre } from '../../api/genreApi';

const validate = (name) => ({
    name: name.trim() === "" ? "El nombre es obligatorio" : null,
});

const GenreCard = ({ id, name, movieCount, onUpdated, onDeleted }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name });
    const [touched, setTouched] = useState({});
    const [updateError, setUpdateError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const errors = validate(form.name);
    const isFormValid = errors.name === null;

    const startEditing = () => {
        setForm({ name });
        setTouched({});
        setUpdateError(null);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setUpdateError(null);
    };

    const handleSave = () => {
        setUpdateError(null);

        if (!isFormValid) {
            setTouched({ name: true });
            return;
        }

        updateGenre(
            id,
            form,
            (updated) => {
                onUpdated(id, updated);
                setIsEditing(false);
            },
            (err) => setUpdateError(err.message || "Error al actualizar el género")
        );
    };

    const handleDelete = () => {
        if (!window.confirm(`¿Eliminar el género "${name}"?`)) return;

        setDeleteError(null);
        deleteGenre(
            id,
            () => onDeleted(id),
            (err) => setDeleteError(err.message || "Error al eliminar el género")
        );
    };

    if (isEditing) {
        return (
            <div className="entity-card">
                {updateError && <p className="msg-inline-error--sm">{updateError}</p>}

                <label>Nombre</label>
                <input
                    className={`form-input form-input--compact ${touched.name && errors.name ? 'form-input--error' : ''}`}
                    value={form.name}
                    onChange={(e) => setForm({ name: e.target.value })}
                    onBlur={() => setTouched({ name: true })}
                />
                {touched.name && errors.name && (
                    <p className="form-error-text">{errors.name}</p>
                )}

                <button
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className={`btn ${isFormValid ? 'btn--save' : 'btn--disabled'} btn-group`}
                >
                    Guardar
                </button>
                <button
                    onClick={cancelEditing}
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
                <span>🎬 {movieCount} película{movieCount === 1 ? "" : "s"}</span>
            </div>

            {deleteError && <p className="msg-inline-error--sm">{deleteError}</p>}

            <button
                onClick={startEditing}
                className="btn btn--primary btn-group"
            >
                Editar
            </button>

            <button
                onClick={handleDelete}
                className="btn btn--delete btn-group"
            >
                Eliminar
            </button>
        </div>
    );
};

export default GenreCard;
