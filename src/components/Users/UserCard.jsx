import EntityCard from '../common/EntityCard';
import { editUserFields, renderUserView, userConfirmDeleteMessage } from './userFields';

const UserCard = ({ id, name, email, role, isActive, onDelete, onEdit, onRestore }) => (
    <EntityCard
        id={id}
        values={{ name, email }}
        fields={editUserFields}
        payloadExtra={{ role }}
        viewExtra={{ isActive }}
        renderView={renderUserView}
        confirmDeleteMessage={userConfirmDeleteMessage}
        deleteLabel="Dar de baja"
        onEdit={isActive ? onEdit : undefined}
        onDelete={isActive ? onDelete : undefined}
        onRestore={isActive ? undefined : onRestore}
    />
);

export default UserCard;
