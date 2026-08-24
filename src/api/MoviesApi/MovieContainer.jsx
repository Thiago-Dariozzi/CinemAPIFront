import React from 'react';
import MovieCard from './MovieCard';

const MovieContainer = ({ movies, onDeleteMovie, onEditMovie }) => {
    const moviesMapped = movies.map((movie) => (
        <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            synopsis={movie.synopsis}
            durationMinutes={movie.durationMinutes}
            genre={movie.genre}
            imageUrl={movie.imageUrl}
            releaseDate={movie.releaseDate}
            isActive={movie.isActive}
            onDelete={onDeleteMovie}
            onEdit={onEditMovie}
        />
    ));

    return (
        <div className="movies-grid">
            {moviesMapped}
        </div>
    );
};

export default MovieContainer;

