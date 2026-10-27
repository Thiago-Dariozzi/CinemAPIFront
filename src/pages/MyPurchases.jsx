import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyPurchases } from '../api/purchaseApi';
import { usePurchaseList } from '../hooks/usePurchaseList';
import PurchaseList from '../components/Purchases/PurchaseList';

const CANCEL_HINT = "Ya no se puede cancelar: faltan 2 horas o menos para la función.";

const MyPurchases = () => {
    const location = useLocation();
    const [now] = useState(() => Date.now());
    const { purchases, loading, error, cancel } = usePurchaseList(getMyPurchases, "No se pudieron cargar tus compras.");

    if (loading) return <p className="msg-loading">Cargando tus entradas...</p>;
    if (error) return <p className="msg-error">{error}</p>;

    const isUpcoming = (purchase) => new Date(purchase.startTime).getTime() > now;
    const upcoming = purchases.filter(isUpcoming).reverse();
    const past = purchases.filter((purchase) => !isUpcoming(purchase));
    const justPurchased = location.state?.purchasedId && purchases.some((p) => p.id === location.state.purchasedId);

    return (
        <main className="dashboard">
            <h1 className="section-title">🎟️ Mis entradas</h1>
            {justPurchased && <p className="msg-success">¡Compra confirmada! Tus entradas están en "Próximas".</p>}

            <h2 className="purchase-section__title">Próximas</h2>
            {upcoming.length === 0 ? (
                <p className="msg-empty">
                    No tenés entradas para funciones próximas. <Link to="/panel/cartelera">Ver la cartelera</Link>
                </p>
            ) : (
                <PurchaseList purchases={upcoming} cancelHint={CANCEL_HINT} onCancel={cancel} />
            )}

            <h2 className="purchase-section__title">Pasadas</h2>
            {past.length === 0
                ? <p className="msg-empty">Todavía no fuiste a ninguna función.</p>
                : <PurchaseList purchases={past} />}
        </main>
    );
};

export default MyPurchases;
