import React from 'react';
import EntityGrid from '../common/EntityGrid';
import GenreCard from './GenreCard';

const GenreContainer = ({ genres, movieCounts, onEdit, onDelete }) => (
    <EntityGrid
        items={genres}
        renderItem={(genre) => (
            <GenreCard
                key={genre.id}
                id={genre.id}
                name={genre.name}
                movieCount={movieCounts[genre.id] ?? 0}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        )}
    />
);

export default GenreContainer;
