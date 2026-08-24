import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getAllUsers, addUser, updateUser, deleteUser } from './UserApi';
import NewUser from './NewUser';
import UserContainer from './UserContainer';

const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllUsers(
            (data) => {
                setUsers(data);
                setIsLoading(false);
            },
            (err) => {
                console.error(err);
                setError("No se pudo conectar con el servidor de usuarios. ¿Está corriendo el backend?");
                setIsLoading(false);
            }
        );
    }, []);

    const handleAddUser = (user) => {
        addUser(
            user,
            (created) => setUsers((prev) => [created, ...prev]),
            (err) => {
                console.error(err);
                setError("Error al agregar el usuario");
            }
        );
    };

    const handleDeleteUser = (id) => {
        deleteUser(
            id,
            () => setUsers((prev) => prev.filter((user) => user.id !== id)),
            (err) => {
                console.error(err);
                setError("Error al eliminar el usuario");
            }
        );
    };

    const handleUpdateUser = (id, user) => {
        updateUser(
            id,
            user,
            (updated) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u))),
            (err) => {
                console.error(err);
                setError("Error al actualizar el usuario");
            }
        );
    };

    return (
        <Container className="py-4">
            <h1 style={{ color: '#ffbd59' }} className="mb-4">👤 Usuarios</h1>
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
