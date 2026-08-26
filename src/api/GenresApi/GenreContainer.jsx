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
        <div className="screens-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            padding: '20px 0'
        }}>
            {genresMapped}
        </div>
    );
};

export default GenreContainer;
