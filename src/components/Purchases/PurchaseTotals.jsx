import { formatMoney } from '../../utils/money';

const PurchaseTotals = ({ subtotal, feeAmount, total, feeLabel = "Cargo por servicio" }) => (
    <dl className="purchase-totals">
        <dt>Subtotal</dt>
        <dd>{formatMoney(subtotal)}</dd>
        <dt>{feeLabel}</dt>
        <dd>{formatMoney(feeAmount)}</dd>
        <dt className="purchase-totals__total">Total</dt>
        <dd className="purchase-totals__total">{formatMoney(total)}</dd>
    </dl>
);

export default PurchaseTotals;
