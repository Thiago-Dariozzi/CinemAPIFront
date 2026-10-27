import EntityCard from '../common/EntityCard';
import { screenFields, screenConfirmDeleteMessage, renderScreenView } from './screenFields';

const ScreenCard = ({ id, name, rows, seatsPerRow, isActive, onDelete, onEdit }) => (
    <EntityCard
        id={id}
        values={{ name, rows, seatsPerRow }}
        fields={screenFields}
        payloadExtra={{ isActive }}
        viewExtra={{ isActive }}
        renderView={renderScreenView}
        confirmDeleteMessage={screenConfirmDeleteMessage}
        onEdit={onEdit}
        onDelete={onDelete}
    />
);

export default ScreenCard;
