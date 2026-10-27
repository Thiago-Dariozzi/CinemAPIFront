import EntityGrid from '../common/EntityGrid';
import UserCard from './UserCard';

const UserContainer = ({ users, onDelete, onEdit, onRestore }) => (
    <EntityGrid
        items={users}
        renderItem={(user) => (
            <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                isActive={user.isActive}
                onDelete={onDelete}
                onEdit={onEdit}
                onRestore={onRestore}
            />
        )}
    />
);

export default UserContainer;
