import React, { useState } from 'react';
import { updateGenre, deleteGenre } from './genreApi';

const inputStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box', marginBottom: '8px' };

const validate = (name) => ({
    name: name.trim() === "" ? "El nombre es obligatorio" : null,
});

// Cada GenreCard llama a la API directamente (como MovieFunctionsPanel con Showtime) en
// vez de delegarle el fetch al dashboard: así el error que devuelve el backend (409 por
// nombre duplicado o género en uso) se muestra pegado a la acción que lo disparó, no en
// un cartel genérico en otro lado de la pantalla.
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
            <div className="screen-card" style={{
                backgroundColor: '#1e1e1e',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #444',
                color: '#fff',
                fontFamily: 'sans-serif'
            }}>
                {updateError && <p style={{ color: '#f44336', fontSize: '0.85rem' }}>{updateError}</p>}

                <label>Nombre</label>
                <input
                    style={{ ...inputStyle, border: `1px solid ${touched.name && errors.name ? '#f44336' : '#555'}` }}
                    value={form.name}
                    onChange={(e) => setForm({ name: e.target.value })}
                    onBlur={() => setTouched({ name: true })}
                />
                {touched.name && errors.name && (
                    <p style={{ color: '#f44336', fontSize: '0.8rem', margin: '0 0 8px' }}>{errors.name}</p>
                )}

                <button
                    onClick={handleSave}
                    disabled={!isFormValid}
                    style={{
                        marginTop: '10px',
                        marginRight: '8px',
                        padding: '8px 16px',
                        backgroundColor: isFormValid ? '#2ecc71' : '#555',
                        color: isFormValid ? '#fff' : '#888',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        opacity: isFormValid ? 1 : 0.6,
                        fontWeight: 'bold'
                    }}
                >
                    Guardar
                </button>
                <button
                    onClick={cancelEditing}
                    style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#7f8c8d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cancelar
                </button>
            </div>
        );
    }

    return (
        <div className="screen-card" style={{
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #444',
            color: '#fff',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ color: '#ffbd59', marginTop: 0 }}>{name}</h2>

            <div style={{ marginBottom: '10px' }}>
                <span>🎬 {movieCount} película{movieCount === 1 ? "" : "s"}</span>
            </div>

            {deleteError && <p style={{ color: '#f44336', fontSize: '0.85rem' }}>{deleteError}</p>}

            <button
                onClick={startEditing}
                style={{
                    marginTop: '10px', marginRight: '8px', display: 'inline-block',
                    padding: '8px 16px', backgroundColor: '#ffbd59', color: '#000',
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                }}
            >
                Editar
            </button>

            <button
                onClick={handleDelete}
                style={{
                    marginTop: '10px', display: 'inline-block',
                    padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff',
                    border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                }}
            >
                Eliminar
            </button>
        </div>
    );
};

export default GenreCard;
