import { useCallback, useEffect, useState } from 'react';

export const useAsyncData = (fetchFn, errorMessage = "No se pudieron cargar los datos.") => {
    const [state, setState] = useState({ data: null, error: null, source: null });
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let ignore = false;
        fetchFn()
            .then((data) => {
                if (!ignore) setState({ data, error: null, source: fetchFn });
            })
            .catch((err) => {
                if (ignore) return;
                console.error(err);
                setState((prev) => ({
                    data: prev.source === fetchFn ? prev.data : null,
                    error: err?.message || errorMessage,
                    source: fetchFn,
                }));
            });
        return () => { ignore = true; };
    }, [fetchFn, errorMessage, version]);

    const reload = useCallback(() => setVersion((prev) => prev + 1), []);

    const setData = useCallback((updater) => setState((prev) => ({
        ...prev,
        data: typeof updater === 'function' ? updater(prev.data) : updater,
    })), []);

    const loading = state.source !== fetchFn;

    return {
        data: loading ? null : state.data,
        error: loading ? null : state.error,
        loading,
        reload,
        setData,
    };
};
