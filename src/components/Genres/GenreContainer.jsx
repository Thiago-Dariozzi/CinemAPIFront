import React from 'react';
import GenreCard from './GenreCard';

const GenreContainer = ({ genres, movieCounts, onUpdated, onDeleted }) => {
    const genresMapped = genres.map((genre) => (
        <GenreCard
            key={genre.id}
            id={genre.id}
            name={genre.name}
            movieCount={movieCounts[genre.id] ?? 0}
            onUpdated={onUpdated}
            onDeleted={onDeleted}
        />
    ));

    return (
        <div className="entity-grid">
            {genresMapped}
        </div>
    );
};

export default GenreContainer;
