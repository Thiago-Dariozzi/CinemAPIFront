import React from 'react';
import EntityCard from '../common/EntityCard';
import { genreFields, genreConfirmDeleteMessage, renderGenreView } from './genreFields';

const GenreCard = ({ id, name, movieCount, onEdit, onDelete }) => (
    <EntityCard
        id={id}
        values={{ name }}
        fields={genreFields}
        viewExtra={{ movieCount }}
        renderView={renderGenreView}
        confirmDeleteMessage={genreConfirmDeleteMessage(name)}
        onEdit={onEdit}
        onDelete={onDelete}
    />
);

export default GenreCard;
