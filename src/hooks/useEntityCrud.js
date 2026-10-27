import { useCallback, useEffect, useState } from 'react';

const mergeResult = (item, payload, result) => ({
    ...item,
    ...payload,
    ...(result && typeof result === 'object' ? result : {}),
});

export const useEntityCrud = ({
    fetchAll,
    addFn,
    updateFn,
    deleteFn,
    restoreFn,
    messages = {},
    silentMutationErrors = false,
    softDelete = false,
    reloadAfterMutation = false,
}) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [reloadToken, setReloadToken] = useState(0);
    const [loadedRequest, setLoadedRequest] = useState(null);

    const fetchErrorMessage = messages.fetchError ?? "No se pudo conectar con el servidor.";

    useEffect(() => {
        let ignore = false;
        fetchAll()
            .then((data) => {
                if (ignore) return;
                setList(data);
                setError(null);
            })
            .catch((err) => {
                if (ignore) return;
                console.error(err);
                setError(fetchErrorMessage);
            })
            .finally(() => {
                if (ignore) return;
                setLoading(false);
                setLoadedRequest({ fetchAll, reloadToken });
            });
        return () => { ignore = true; };
    }, [fetchAll, fetchErrorMessage, reloadToken]);

    const refreshing = !loading
        && (loadedRequest?.fetchAll !== fetchAll || loadedRequest?.reloadToken !== reloadToken);

    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    const mutate = async (action, applyToList, successMessage, errorMessage) => {
        try {
            const result = await action();
            setList(applyToList(result));
            if (successMessage !== undefined) setSuccess(successMessage);
            if (!silentMutationErrors) setError(null);
            if (reloadAfterMutation) reload();
            return result;
        } catch (err) {
            if (!silentMutationErrors) setError(err?.message || errorMessage);
            console.error(err);
            throw err;
        }
    };

    const handleAdd = addFn && ((payload) => mutate(
        () => addFn(payload),
        (created) => (prev) => [created, ...prev],
        messages.addSuccess,
        messages.addError || "Error al agregar",
    ));

    const handleUpdate = updateFn && ((id, payload) => mutate(
        () => updateFn(id, payload),
        (result) => (prev) => prev.map((item) => (item.id === id ? mergeResult(item, payload, result) : item)),
        messages.updateSuccess,
        messages.updateError || "Error al actualizar",
    ));

    const handleDelete = deleteFn && ((id) => mutate(
        () => deleteFn(id),
        () => (prev) => (softDelete
            ? prev.map((item) => (item.id === id ? { ...item, isActive: false } : item))
            : prev.filter((item) => item.id !== id)),
        messages.deleteSuccess,
        messages.deleteError || "Error al eliminar",
    ));

    const handleRestore = restoreFn && ((id) => mutate(
        () => restoreFn(id),
        () => (prev) => prev.map((item) => (item.id === id ? { ...item, isActive: true } : item)),
        messages.restoreSuccess,
        messages.restoreError || "Error al reactivar",
    ));

    return { list, loading, refreshing, error, success, reload, handleAdd, handleUpdate, handleDelete, handleRestore };
};
