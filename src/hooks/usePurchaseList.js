import { useCallback } from 'react';
import { cancelPurchase } from '../api/purchaseApi';
import { useAsyncData } from './useAsyncData';

export const usePurchaseList = (fetchPurchases, errorMessage) => {
    const { data, loading, error, reload, setData } = useAsyncData(fetchPurchases, errorMessage);

    const cancel = useCallback(async (id) => {
        const updated = await cancelPurchase(id);
        setData((prev) => (prev ?? []).map((purchase) => (purchase.id === id ? updated : purchase)));
        return updated;
    }, [setData]);

    return { purchases: data ?? [], loading, error, reload, cancel };
};
