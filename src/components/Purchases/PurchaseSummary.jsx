import { calculatePurchaseTotals, formatMoney } from '../../utils/money';
import { seatLabel } from '../../utils/seats';
import PurchaseTotals from './PurchaseTotals';

const feeDescription = (fee) => {
    if (!fee) return "Cargo por servicio";
    const parts = [];
    if (fee.percentage > 0) parts.push(`${fee.percentage} %`);
    if (fee.fixedAmount > 0) parts.push(`${formatMoney(fee.fixedAmount)} fijo`);
    return parts.length > 0 ? `${fee.name} (${parts.join(' + ')})` : fee.name;
};

const describeSeats = (seats) => {
    if (seats.length === 0) return "Elegí tus butacas en el mapa.";
    const noun = seats.length === 1 ? 'butaca' : 'butacas';
    return `${seats.length} ${noun}: ${seats.map(seatLabel).join(', ')}`;
};

const PurchaseSummary = ({ seats, price, fee, maxSeats, isSubmitting, canConfirm, onConfirm }) => {
    const totals = calculatePurchaseTotals(price, seats.length, fee);
    const isEnabled = canConfirm && !isSubmitting;

    return (
        <aside className="purchase-summary">
            <h2 className="purchase-summary__title">Resumen</h2>
            <p className="purchase-summary__seats">{describeSeats(seats)}</p>
            <p className="functions-muted">
                {formatMoney(price)} por entrada · máximo {maxSeats} por compra
            </p>
            <PurchaseTotals {...totals} feeLabel={feeDescription(fee)} />
            <button
                type="button"
                className={`btn btn--submit ${isEnabled ? '' : 'btn--disabled'}`}
                disabled={!isEnabled}
                onClick={onConfirm}
            >
                {isSubmitting ? "Confirmando..." : "Confirmar compra"}
            </button>
        </aside>
    );
};

export default PurchaseSummary;
