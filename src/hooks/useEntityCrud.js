import { useEffect, useState } from 'react';
export const useEntityCrud = ({
    fetchAll,
    addFn,
    updateFn,
    deleteFn,
    messages = {},
    silentMutationErrors = false,
}) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const refetch = async () => {
        try {
            setLoading(true);
            const data = await fetchAll();
            setList(data);
            setError(null);
        } catch (err) {
            setError(messages.fetchError ?? "No se pudo conectar con el servidor.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdd = addFn && (async (payload) => {
        try {
            const created = await addFn(payload);
            setList((prev) => [created, ...prev]);
            if (messages.addSuccess !== undefined) setSuccess(messages.addSuccess);
            if (!silentMutationErrors) setError(null);
            return created;
        } catch (err) {
            if (!silentMutationErrors) setError(messages.addError ?? "Error al agregar");
            console.error(err);
            throw err;
        }
    });

    const handleUpdate = updateFn && (async (id, payload) => {
        try {
            const result = await updateFn(id, payload);
            setList((prev) => prev.map((item) => (
                item.id === id
                    ? { ...item, ...payload, ...(result && typeof result === 'object' ? result : {}) }
                    : item
            )));
            if (messages.updateSuccess !== undefined) setSuccess(messages.updateSuccess);
            if (!silentMutationErrors) setError(null);
            return result;
        } catch (err) {
            if (!silentMutationErrors) setError(messages.updateError ?? "Error al actualizar");
            console.error(err);
            throw err;
        }
    });

    const handleDelete = deleteFn && (async (id) => {
        try {
            await deleteFn(id);
            setList((prev) => prev.filter((item) => item.id !== id));
            if (messages.deleteSuccess !== undefined) setSuccess(messages.deleteSuccess);
            if (!silentMutationErrors) setError(null);
        } catch (err) {
            if (!silentMutationErrors) setError(messages.deleteError ?? "Error al eliminar");
            console.error(err);
            throw err;
        }
    });

    return { list, loading, error, success, refetch, handleAdd, handleUpdate, handleDelete };
};
