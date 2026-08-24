import React, { useState } from 'react';

const inputStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box', marginBottom: '8px' };

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
        // El backend reemplaza la sala entera: mandamos id + isActive originales además
        // de los campos editados.
        onEdit(id, { ...form, id, isActive });
        setIsEditing(false);
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
                <label>Nombre</label>
                <input style={inputStyle} value={form.name} onChange={(e) => handleChangeValue(e, "name")} />

                <label>Capacidad</label>
                <input style={inputStyle} type="number" value={form.capacity} onChange={(e) => handleChangeValue(e, "capacity")} />

                <button
                    onClick={handleSave}
                    style={{ marginTop: '10px', marginRight: '8px', padding: '8px 16px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Guardar
                </button>
                <button
                    onClick={() => setIsEditing(false)}
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
                <span> Capacidad: {capacity}</span>
            </div>

            <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: isActive ? '#2ecc71' : '#e74c3c',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 'bold'
            }}>
                {isActive ? "✅ Activa" : "❌ Inactiva"}
            </div>

            {onEdit && (
                <button
                    onClick={() => setIsEditing(true)}
                    style={{
                        marginTop: '10px',
                        marginRight: '8px',
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#ffbd59',
                        color: '#000',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Editar
                </button>
            )}

            {onDelete && (
                <button
                    onClick={() => {if (window.confirm("¿Estás seguro de eliminar esta sala?"))
                         onDelete(id)}}
                    style={{
                        marginTop: '10px',
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Eliminar
                </button>
            )}
        </div>
    );
};

export default ScreenCard;
