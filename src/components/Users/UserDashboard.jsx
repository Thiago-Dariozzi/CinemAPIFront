import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAllUsers, addUser, updateUser, deleteUser } from '../../api/userApi';
import NewUser from './NewUser';
import UserContainer from './UserContainer';

const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        const loadUsers = async () => {
            try {
                const data = await getAllUsers();
                if (ignore) return;
                setUsers(data);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                if (ignore) return;
                setError("No se pudo conectar con el servidor de usuarios. ¿Está corriendo el backend?");
                setIsLoading(false);
            }
        };

        loadUsers();
        return () => { ignore = true; };
    }, []);

    const handleAddUser = async (user) => {
        try {
            const created = await addUser(user);
            setUsers((prev) => [created, ...prev]);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Error al agregar el usuario");
            throw err;
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Error al eliminar el usuario");
        }
    };

    const handleUpdateUser = async (id, user) => {
        try {
            const updated = await updateUser(id, user);
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Error al actualizar el usuario");
            throw err;
        }
    };

    return (
        <Container className="py-4">
            <h1 className="accent-title mb-4">👤 Usuarios</h1>
            {error && <p className="text-danger">{error}</p>}
            <NewUser onAddUser={handleAddUser} />
            <UserContainer
                isLoading={isLoading}
                users={users}
                onDelete={handleDeleteUser}
                onEdit={handleUpdateUser}
            />
        </Container>
    );
};

export default UserDashboard;
