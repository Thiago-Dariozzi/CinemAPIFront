import React, { useState, useEffect } from 'react';
import { getAllScreens, addNewScreen, updateScreen, deleteScreen } from '../../api/screenApi';
import NewScreen from './NewScreen';
import ScreenContainer from './ScreenContainer';

const ScreenDashboard = () => {
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchScreens();
    }, []);

    const fetchScreens = async () => {
        try {
            setLoading(true);
            const data = await getAllScreens();
            setScreens(data);
            setError(null);
        } catch (err) {
            setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddScreen = async (screen) => {
        try {
            const created = await addNewScreen(screen);
            setScreens((prev) => [created, ...prev]);
            setSuccess("Sala creada correctamente");
        } catch (err) {
            setError("Error al agregar la sala");
            console.error(err);
        }
    };

    const handleUpdateScreen = async (id, screen) => {
        try {
            await updateScreen(id, screen);
            setScreens((prev) => prev.map((s) => (s.id === id ? { ...s, ...screen } : s)));
            setSuccess("Sala actualizada correctamente");
        } catch (err) {
            setError("Error al actualizar la sala");
            console.error(err);
        }
    };

    const handleDeleteScreen = async (id) => {
        try {
            await deleteScreen(id);
            setScreens((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setError("Error al eliminar la sala");
            console.error(err);
        }
    };

    if (loading) return <p className="msg-loading">Cargando salas...</p>;

    return (
        <main className="dashboard">
            {error && (
                <p className="msg-error">
                    {error}
                </p>
            )}
            {success && (
            <p className="msg-success">
                {success}
            </p>
            )}
            <NewScreen onAddScreen={handleAddScreen} />
            {screens.length === 0 ? <p className="msg-empty">No hay salas cargadas</p> : null}
            <ScreenContainer screens={screens} onDeleteScreen={handleDeleteScreen} onEditScreen={handleUpdateScreen} />
        </main>
    );
};

export default ScreenDashboard;
