import { useCallback, useState } from 'react';
import { getAllMovies } from '../api/movieApi';
import { getShowtimesByMovie } from '../api/showtimeApi';
import { cancelPurchase, getPurchases } from '../api/purchaseApi';
import { useEntityList } from '../hooks/useEntityList';
import { usePurchaseList } from '../hooks/usePurchaseList';
import { formatMoney } from '../utils/money';
import SalesFilters from '../components/Purchases/SalesFilters';
import PurchaseList from '../components/Purchases/PurchaseList';

const EMPTY_FILTERS = { movieId: "", showtimeId: "", from: "", to: "", status: "" };

const noShowtimes = () => Promise.resolve([]);

const SalesPage = () => {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const movies = useEntityList(getAllMovies);
    const fetchShowtimes = useCallback(
        () => (filters.movieId ? getShowtimesByMovie(filters.movieId) : noShowtimes()),
        [filters.movieId],
    );
    const showtimes = useEntityList(fetchShowtimes);
    const fetchPurchases = useCallback(() => getPurchases(filters), [filters]);
    const { purchases, loading, error, cancel } = usePurchaseList(fetchPurchases, cancelPurchase, "No se pudieron cargar las ventas.");

    const handleChange = (key, value) => setFilters((prev) => ({
        ...prev,
        [key]: value,
        ...(key === 'movieId' && { showtimeId: "" }),
    }));

    const confirmed = purchases.filter((purchase) => purchase.status === "Confirmed");
    const revenue = confirmed.reduce((sum, purchase) => sum + purchase.total, 0);
    const ticketCount = confirmed.reduce((sum, purchase) => sum + purchase.tickets.length, 0);

    return (
        <main className="dashboard">
            <h1 className="section-title">💰 Ventas</h1>
            <SalesFilters
                filters={filters}
                movies={movies}
                showtimes={filters.movieId ? showtimes : []}
                onChange={handleChange}
                onClear={() => setFilters(EMPTY_FILTERS)}
            />
            {error && <p className="msg-error">{error}</p>}
            {loading ? <p className="msg-loading">Cargando ventas...</p> : (
                <>
                    <p className="sales-summary">
                        {purchases.length} {purchases.length === 1 ? 'compra' : 'compras'} · {ticketCount} entradas vendidas · Recaudado: {formatMoney(revenue)}
                    </p>
                    {purchases.length === 0
                        ? !error && <p className="msg-empty">No hay ventas con esos filtros.</p>
                        : <PurchaseList purchases={purchases} showCustomer onCancel={cancel} />}
                </>
            )}
        </main>
    );
};

export default SalesPage;
