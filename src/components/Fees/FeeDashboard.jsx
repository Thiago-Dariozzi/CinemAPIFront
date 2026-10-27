import { useEntityCrud } from '../../hooks/useEntityCrud';
import { getAllFees, addFee, updateFee, deleteFee } from '../../api/feeApi';
import NewFee from './NewFee';
import FeeContainer from './FeeContainer';

const FeeDashboard = () => {
    const { list: fees, loading, error, success, handleAdd, handleUpdate, handleDelete } = useEntityCrud({
        fetchAll: getAllFees,
        addFn: addFee,
        updateFn: updateFee,
        deleteFn: deleteFee,
        messages: {
            fetchError: "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
            addSuccess: "Cargo creado correctamente",
            updateSuccess: "Cargo actualizado correctamente",
            deleteSuccess: "Cargo eliminado",
        },
        silentMutationErrors: true,
        reloadAfterMutation: true,
    });

    if (loading) return <p className="msg-loading">Cargando cargos...</p>;

    const hasCurrent = fees.some((fee) => fee.isCurrent);

    return (
        <main className="dashboard">
            <h1 className="section-title">🧾 Cargos</h1>
            {error && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
            {fees.length > 0 && !hasCurrent && !error && (
                <p className="msg-empty">No hay ningún cargo vigente: las compras nuevas no suman cargo por servicio.</p>
            )}
            <NewFee onAddFee={handleAdd} />
            {fees.length === 0 && !error && <p className="msg-empty">No hay cargos cargados</p>}
            <FeeContainer fees={fees} onDeleteFee={handleDelete} onEditFee={handleUpdate} />
        </main>
    );
};

export default FeeDashboard;
