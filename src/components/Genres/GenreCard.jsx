import EntityCard from '../common/EntityCard';
import { genreFields, genreConfirmDeleteMessage, renderGenreView } from './genreFields';

// Editable card for a genre
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
