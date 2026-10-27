import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSeatMap } from '../api/showtimeApi';
import { getCurrentFee } from '../api/feeApi';
import { createPurchase } from '../api/purchaseApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { formatShowtime } from '../utils/formatShowtime';
import { seatKey } from '../utils/seats';
import SeatMap from '../components/Purchases/SeatMap';
import PurchaseSummary from '../components/Purchases/PurchaseSummary';

const PurchaseView = ({ showtimeId }) => {
    const navigate = useNavigate();
    const fetchSeatMap = useCallback(() => getSeatMap(showtimeId), [showtimeId]);
    const seatMap = useAsyncData(fetchSeatMap, "No se pudo cargar el mapa de butacas.");
    const fee = useAsyncData(getCurrentFee, "No se pudo obtener el cargo por servicio.");
    const map = seatMap.data;
    const takenKeys = useMemo(() => new Set((map?.takenSeats ?? []).map(seatKey)), [map]);
    const { selected: chosenSeats, toggle, maxSeats } = useSeatSelection(takenKeys);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const selectedKeys = new Set(chosenSeats.map(seatKey));

    const handleConfirm = async () => {
        setSubmitError(null);
        setIsSubmitting(true);
        try {
            const purchase = await createPurchase({ showtimeId, seats: chosenSeats });
            navigate('/panel/mis-entradas', { state: { purchasedId: purchase.id } });
        } catch (err) {
            setSubmitError(err?.message || "No se pudo confirmar la compra");
            if (err?.status === 409) seatMap.reload();
            setIsSubmitting(false);
        }
    };

    if (seatMap.loading) return <p className="msg-loading">Cargando butacas...</p>;
    if (!map) return <p className="msg-error">{seatMap.error}</p>;

    return (
        <main className="dashboard">
            <Link to={`/panel/peliculas/${map.movieId}`} className="back-link">← Volver a las funciones</Link>
            <h1 className="section-title">🎟️ {map.movieTitle}</h1>
            <p className="functions-muted">{formatShowtime(map.startTime)} · {map.screenName}</p>

            {!map.isOnSale && <p className="msg-error">Esta función ya no está a la venta.</p>}
            {seatMap.error && <p className="msg-error">{seatMap.error}</p>}
            {fee.error && <p className="msg-error">{fee.error} El total final se calcula al confirmar.</p>}
            {submitError && <p className="msg-error">{submitError}</p>}

            <div className="purchase-layout">
                <SeatMap
                    rows={map.rows}
                    seatsPerRow={map.seatsPerRow}
                    takenKeys={takenKeys}
                    selectedKeys={selectedKeys}
                    isFull={chosenSeats.length >= maxSeats}
                    disabled={!map.isOnSale || isSubmitting}
                    onToggle={toggle}
                />
                <PurchaseSummary
                    seats={chosenSeats}
                    price={map.price}
                    fee={fee.data}
                    maxSeats={maxSeats}
                    isSubmitting={isSubmitting}
                    canConfirm={map.isOnSale && chosenSeats.length > 0}
                    onConfirm={handleConfirm}
                />
            </div>
        </main>
    );
};

const PurchasePage = () => {
    const { showtimeId } = useParams();
    return <PurchaseView key={showtimeId} showtimeId={showtimeId} />;
};

export default PurchasePage;
