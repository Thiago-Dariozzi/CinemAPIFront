import { useCallback } from 'react';
import { useAsyncData } from './useAsyncData';

export const usePurchaseList = (fetchPurchases, cancelPurchase, errorMessage) => {
    const { data, loading, error, reload, setData } = useAsyncData(fetchPurchases, errorMessage);

    const cancel = useCallback(async (id) => {
        const updated = await cancelPurchase(id);
        setData((prev) => (prev ?? []).map((purchase) => (purchase.id === id ? updated : purchase)));
        return updated;
    }, [cancelPurchase, setData]);

    return { purchases: data ?? [], loading, error, reload, cancel };
};
