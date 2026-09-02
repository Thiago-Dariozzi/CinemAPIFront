import React from 'react';
import EntityGrid from '../common/EntityGrid';
import MovieCard from './MovieCard';

const MovieContainer = ({ movies, genres = [], onDeleteMovie, onEditMovie }) => (
    <EntityGrid
        items={movies}
        className="movies-grid"
        renderItem={(movie) => (
            <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                synopsis={movie.synopsis}
                durationMinutes={movie.durationMinutes}
                genreId={movie.genreId}
                genres={genres}
                imageUrl={movie.imageUrl}
                releaseDate={movie.releaseDate}
                suggestedPrice={movie.suggestedPrice}
                isActive={movie.isActive}
                onDelete={onDeleteMovie}
                onEdit={onEditMovie}
            />
        )}
    />
);

export default MovieContainer;
