import React from 'react';
import { useEntityCrud } from '../../hooks/useEntityCrud';
import { getAllScreens, addNewScreen, updateScreen, deleteScreen } from '../../api/screenApi';
import NewScreen from './NewScreen';
import ScreenContainer from './ScreenContainer';

const ScreenDashboard = () => {
    const { list: screens, loading, error, success, handleAdd, handleUpdate, handleDelete } = useEntityCrud({
        fetchAll: getAllScreens,
        addFn: addNewScreen,
        updateFn: updateScreen,
        deleteFn: deleteScreen,
        messages: {
            fetchError: "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
            addSuccess: "Sala creada correctamente",
            addError: "Error al agregar la sala",
            updateSuccess: "Sala actualizada correctamente",
            updateError: "Error al actualizar la sala",
            deleteError: "Error al eliminar la sala",
        },
    });

    if (loading) return <p className="msg-loading">Cargando salas...</p>;

    return (
        <main className="dashboard">
            {error && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
            <NewScreen onAddScreen={handleAdd} />
            {screens.length === 0 ? <p className="msg-empty">No hay salas cargadas</p> : null}
            <ScreenContainer screens={screens} onDeleteScreen={handleDelete} onEditScreen={handleUpdate} />
        </main>
    );
};

export default ScreenDashboard;
