import { useState } from 'react';
import { formatShowtime } from '../../utils/formatShowtime';
import { seatLabel } from '../../utils/seats';
import PurchaseTotals from './PurchaseTotals';

const STATUS_LABELS = { Confirmed: "Confirmada", Cancelled: "Cancelada" };

const PurchaseCard = ({ purchase, showCustomer = false, cancelHint, onCancel }) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);
    const isConfirmed = purchase.status === "Confirmed";

    const handleCancel = async () => {
        if (!window.confirm("¿Seguro que querés cancelar esta compra? Las butacas quedan libres.")) return;
        setCancelError(null);
        setIsCancelling(true);
        try {
            await onCancel(purchase.id);
        } catch (err) {
            setCancelError(err?.message || "No se pudo cancelar la compra");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <article className={`entity-card purchase-card ${isConfirmed ? '' : 'purchase-card--cancelled'}`}>
            <h2 className="entity-card__title">{purchase.movieTitle}</h2>
            <div className="entity-card__detail">
                <div>📅 {formatShowtime(purchase.startTime)}</div>
                <div>🏛️ {purchase.screenName}</div>
                <div>💺 {purchase.tickets.map(seatLabel).join(', ')}</div>
                {showCustomer && <div>👤 {purchase.userName} · {purchase.userEmail}</div>}
                <div className="functions-muted">Comprada el {formatShowtime(purchase.createdAt)}</div>
            </div>

            <PurchaseTotals subtotal={purchase.subtotal} feeAmount={purchase.feeAmount} total={purchase.total} />

            <div className={`status-pill ${isConfirmed ? 'status-pill--active' : 'status-pill--inactive'}`}>
                {STATUS_LABELS[purchase.status] ?? purchase.status}
            </div>
            {!isConfirmed && purchase.cancelledAt && (
                <p className="functions-muted">Cancelada el {formatShowtime(purchase.cancelledAt)}</p>
            )}

            {cancelError && <p className="msg-inline-error--sm">{cancelError}</p>}
            {onCancel && purchase.canCancel && (
                <button type="button" className="btn btn--delete btn-group" disabled={isCancelling} onClick={handleCancel}>
                    {isCancelling ? "Cancelando..." : "Cancelar compra"}
                </button>
            )}
            {isConfirmed && !purchase.canCancel && cancelHint && <p className="functions-muted">{cancelHint}</p>}
        </article>
    );
};

export default PurchaseCard;
