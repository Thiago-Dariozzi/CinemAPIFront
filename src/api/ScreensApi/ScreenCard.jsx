import React from 'react';

const ScreenCard = ({
    id,
    name,
    capacity,
    isActive,
    onDelete
}) => {
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

            {onDelete && (
                <button
                    onClick={() => {if (window.confirm("¿Estás seguro de eliminar esta sala?"))
                         onDelete(id)}}
                    style={{
                        marginTop: '10px',
                        display: 'block',
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
