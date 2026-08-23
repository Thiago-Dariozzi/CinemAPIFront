import React, { useState } from 'react';

const inputStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box', marginBottom: '8px' };

const MovieCard = ({
    id,
    title,
    synopsis,
    durationMinutes,
    genre,
    imageUrl,
    releaseDate,
    isActive,
    onDelete,
    onEdit
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ title, synopsis, durationMinutes, genre, imageUrl, releaseDate, isActive });

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
            <div className="movie-card">
                <div className="movie-info">
                    <label>Título</label>
                    <input style={inputStyle} value={form.title} onChange={(e) => handleChangeValue(e, "title")} />

                    <label>Género</label>
                    <input style={inputStyle} value={form.genre} onChange={(e) => handleChangeValue(e, "genre")} />

                    <label>Sinopsis</label>
                    <input style={inputStyle} value={form.synopsis} onChange={(e) => handleChangeValue(e, "synopsis")} />

                    <label>URL Imagen</label>
                    <input style={inputStyle} value={form.imageUrl} onChange={(e) => handleChangeValue(e, "imageUrl")} />

                    <label>Minutos</label>
                    <input style={inputStyle} type="number" value={form.durationMinutes} onChange={(e) => handleChangeValue(e, "durationMinutes")} />

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
            </div>
        );
    }

    return (
        <div className="movie-card">
            {imageUrl && <img className="movie-image" src={imageUrl} alt={title} />}

            <div className="movie-info">
                <h2 className="movie-title">{title}</h2>

                <div className="movie-details">
                    <span>🎭 {genre}</span> | <span>⏱️ {durationMinutes} min</span>
                </div>

                <p className="movie-synopsis">{synopsis}</p>

                <div className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                    {isActive ? "🎬 En Cartelera" : "❌ Fuera de Cartelera"}
                </div>

                {onEdit && (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{
                            marginTop: '10px',
                            marginRight: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#ffbd59',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Actualizar
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={() => onDelete(id)}
                        style={{
                            marginTop: '10px',
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
        </div>
    );
};

export default MovieCard;
