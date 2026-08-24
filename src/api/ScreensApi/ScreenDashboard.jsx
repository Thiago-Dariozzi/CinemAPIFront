import React, { useState, useEffect } from 'react';
import { getAllScreens, addNewScreen, deleteScreen } from './ScreenApi';
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

    const handleDeleteScreen = async (id) => {
        try {
            await deleteScreen(id);
            setScreens((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            setError("Error al eliminar la sala");
            console.error(err);
        }
    };

    if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Cargando salas...</p>;

    return (
        <main style={{ padding: '0 20px' }}>
            {error && (
                <p style={{ color: '#e74c3c', textAlign: 'center', padding: '10px',
                    backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #e74c3c' }}>
                    {error}
                </p>
            )}
            {success && (
            <p style={{ color: '#2ecc71', textAlign: 'center', padding: '10px',
                backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #2ecc71' }}>
                {success}
            </p>
            )}
            <NewScreen onAddScreen={handleAddScreen} />
            {screens.length === 0 ? <p style={{ color: 'white', textAlign: 'center' }}>No hay salas cargadas</p> : null}
            <ScreenContainer screens={screens} onDeleteScreen={handleDeleteScreen} />
        </main>
    );
};

export default ScreenDashboard;
