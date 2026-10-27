import { useCallback, useState } from 'react';
import { getAllUsers, addUser, updateUser, deleteUser, reactivateUser } from '../../api/userApi';
import { ROLES } from '../../auth/roles';
import { useEntityCrud } from '../../hooks/useEntityCrud';
import NewUser from './NewUser';
import UserContainer from './UserContainer';
import UserSearch from './UserSearch';

const TEXTS = {
    [ROLES.client]: { page: "👥 Clientes", form: "Agregar nuevo cliente", loading: "Cargando clientes...", empty: "No hay clientes" },
    [ROLES.admin]: { page: "🛡️ Administradores", form: "Agregar nuevo administrador", loading: "Cargando administradores...", empty: "No hay administradores" },
};

const UserDashboard = ({ role }) => {
    const [search, setSearch] = useState("");
    const fetchUsers = useCallback(() => getAllUsers(role, search), [role, search]);
    const { list: users, loading, refreshing, error, success, handleAdd, handleUpdate, handleDelete, handleRestore } = useEntityCrud({
        fetchAll: fetchUsers,
        addFn: addUser,
        updateFn: updateUser,
        deleteFn: deleteUser,
        restoreFn: reactivateUser,
        messages: {
            fetchError: "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
            addSuccess: "Usuario creado correctamente",
            updateSuccess: "Usuario actualizado correctamente",
            deleteSuccess: "Usuario dado de baja",
            restoreSuccess: "Usuario reactivado",
        },
        silentMutationErrors: true,
        softDelete: true,
        reloadAfterMutation: true,
    });
    const texts = TEXTS[role];

    if (loading) return <p className="msg-loading">{texts.loading}</p>;

    return (
        <main className="dashboard">
            <h1 className="section-title">{texts.page}</h1>
            {error && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
            <NewUser title={texts.form} role={role} onAddUser={handleAdd} />
            <UserSearch search={search} onSearch={setSearch} />
            {refreshing && <p className="msg-loading">Actualizando la lista...</p>}
            {!refreshing && users.length === 0 && !error && (
                <p className="msg-empty">{search ? `Nadie coincide con "${search}"` : texts.empty}</p>
            )}
            <UserContainer users={users} onDelete={handleDelete} onEdit={handleUpdate} onRestore={handleRestore} />
        </main>
    );
};

export default UserDashboard;
