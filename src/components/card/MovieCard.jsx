import React from 'react';

const MovieCard = ({
    id,
    title,
    synopsis,
    durationMinutes,
    genre,
    imageUrl,
    releaseDate,
    isActive,
    onDelete
}) => {
    return (
        <div className="movie-card">
            <img className="movie-image" src={imageUrl} alt={title} />

            <div className="movie-info">
                <h2 className="movie-title">{title}</h2>

                <div className="movie-details">
                    <span>🎭 {genre}</span> | <span>⏱️ {durationMinutes} min</span>
                </div>

                <p className="movie-synopsis">{synopsis}</p>

                <div className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                    {isActive ? "🎬 En Cartelera" : "❌ Fuera de Cartelera"}
                </div>

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