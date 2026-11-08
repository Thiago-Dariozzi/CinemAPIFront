import { formatMoney } from '../../utils/money';

// Formats a number
const formatCount = (value) => value.toLocaleString('es-AR');

// Total sales cards
const SummaryCards = ({ report }) => {
    const cards = [
        { label: "Entradas vendidas", value: formatCount(report.ticketsSold), detail: `${formatCount(report.purchases)} compras` },
        { label: "Recaudación total", value: formatMoney(report.totalRevenue), detail: `Entradas: ${formatMoney(report.ticketRevenue)}`, highlight: true },
        { label: "Cargos cobrados", value: formatMoney(report.feesCollected), detail: "Cargo por servicio" },
        { label: "Entradas canceladas", value: formatCount(report.ticketsCancelled), detail: "De compras del período" },
    ];

    return (
        <dl className="summary-cards">
            {cards.map((card) => (
                <div key={card.label} className={`summary-card ${card.highlight ? 'summary-card--highlight' : ''}`}>
                    <dt className="summary-card__label">{card.label}</dt>
                    <dd className="summary-card__value">{card.value}</dd>
                    <dd className="summary-card__detail">{card.detail}</dd>
                </div>
            ))}
        </dl>
    );
};

export default SummaryCards;
