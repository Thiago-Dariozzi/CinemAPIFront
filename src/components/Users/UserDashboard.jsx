import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAllUsers, addUser, updateUser, deleteUser } from '../../api/userApi';
import NewUser from './NewUser';
import UserContainer from './UserContainer';

const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError("No se pudo conectar con el servidor de usuarios. ¿Está corriendo el backend?");
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleAddUser = async (user) => {
        try {
            const created = await addUser(user);
            setUsers((prev) => [created, ...prev]);
        } catch (err) {
            console.error(err);
            setError("Error al agregar el usuario");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (err) {
            console.error(err);
            setError("Error al eliminar el usuario");
        }
    };

    const handleUpdateUser = async (id, user) => {
        try {
            const updated = await updateUser(id, user);
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
        } catch (err) {
            console.error(err);
            setError("Error al actualizar el usuario");
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
