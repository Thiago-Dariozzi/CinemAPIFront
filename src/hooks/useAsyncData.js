import { useCallback, useEffect, useState } from 'react';

// Loads data once per fetchFn and exposes reload
export const useAsyncData = (fetchFn, errorMessage = "No se pudieron cargar los datos.") => {
    const [state, setState] = useState({ data: null, error: null, errorStatus: null, source: null });
    const [version, setVersion] = useState(0);

    // Fetches data and stores it or the error
    useEffect(() => {
        let ignore = false;
        fetchFn()
            .then((data) => {
                if (!ignore) setState({ data, error: null, errorStatus: null, source: fetchFn });
            })
            .catch((err) => {
                if (ignore) return;
                console.error(err);
                setState((prev) => ({
                    data: prev.source === fetchFn ? prev.data : null,
                    error: err?.message || errorMessage,
                    errorStatus: err?.status ?? null,
                    source: fetchFn,
                }));
            });
        return () => { ignore = true; };
    }, [fetchFn, errorMessage, version]);

    // Triggers a new fetch
    const reload = useCallback(() => setVersion((prev) => prev + 1), []);

    // Updates loaded data locally
    const setData = useCallback((updater) => setState((prev) => ({
        ...prev,
        data: typeof updater === 'function' ? updater(prev.data) : updater,
    })), []);

    const loading = state.source !== fetchFn;

    return {
        data: loading ? null : state.data,
        error: loading ? null : state.error,
        errorStatus: loading ? null : state.errorStatus,
        loading,
        reload,
        setData,
    };
};
