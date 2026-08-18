import React from 'react'

const MovieCard = ({
    id, 
    title, 
    synopsis, 
    durationMinutes, 
    genre, 
    imageUrl, 
    releaseDate, 
    isActive
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
      </div>

    </div>
  )
}

export default MovieCard