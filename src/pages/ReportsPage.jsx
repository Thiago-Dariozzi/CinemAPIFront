import { useCallback, useState } from 'react';
import { getOccupancyReport, getSalesReport } from '../api/reportApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { formatLongDate, toDateKey } from '../utils/dates';
import { DEFAULT_PRESET_LABEL, rangePresets } from '../components/Reports/reportRange';
import OccupancyDateForm from '../components/Reports/OccupancyDateForm';
import ReportRangeForm from '../components/Reports/ReportRangeForm';
import SummaryCards from '../components/Reports/SummaryCards';
import MovieSalesTable from '../components/Reports/MovieSalesTable';
import OccupancyTable from '../components/Reports/OccupancyTable';
import { EmptyState, ErrorState, LoadingState } from '../components/common/LoadState';

const SalesSection = ({ sales }) => {
    if (sales.loading) return <LoadingState message="Calculando ventas..." />;
    if (sales.error) return <ErrorState message={sales.error} onRetry={sales.reload} />;

    return (
        <>
            <p className="report-section__hint" aria-live="polite">
                Mostrando compras del {formatLongDate(sales.data.from)} al {formatLongDate(sales.data.to)}.
            </p>
            <SummaryCards report={sales.data} />
            {sales.data.byMovie.length === 0
                ? <EmptyState title="No hubo ventas confirmadas en ese período." />
                : <MovieSalesTable report={sales.data} />}
        </>
    );
};

const OccupancySection = ({ occupancy }) => {
    if (occupancy.loading) return <LoadingState message="Calculando ocupación..." />;
    if (occupancy.error) return <ErrorState message={occupancy.error} onRetry={occupancy.reload} />;
    if (occupancy.data.showtimes.length === 0) return <EmptyState title="No hay funciones ese día." />;
    return <OccupancyTable report={occupancy.data} />;
};

const ReportsPage = () => {
    const [today] = useState(() => new Date());
    const presets = rangePresets(today);
    const [range, setRange] = useState(() => {
        const preset = presets.find((p) => p.label === DEFAULT_PRESET_LABEL);
        return { from: preset.from, to: preset.to };
    });
    const [occupancyDate, setOccupancyDate] = useState(() => toDateKey(today));

    const fetchSales = useCallback(() => getSalesReport(range), [range]);
    const fetchOccupancy = useCallback(() => getOccupancyReport(occupancyDate), [occupancyDate]);
    const sales = useAsyncData(fetchSales, "No se pudo obtener el reporte de ventas.");
    const occupancy = useAsyncData(fetchOccupancy, "No se pudo obtener el reporte de ocupación.");

    return (
        <section className="dashboard reports">
            <h1 className="section-title">📊 Reportes</h1>

            <section className="report-section" aria-labelledby="sales-title">
                <h2 id="sales-title" className="report-section__title">Ventas</h2>
                <p className="report-section__hint">Compras confirmadas según el día en que se hicieron.</p>
                <ReportRangeForm range={range} presets={presets} onApply={setRange} />
                <SalesSection sales={sales} />
            </section>

            <section className="report-section" aria-labelledby="occupancy-title">
                <h2 id="occupancy-title" className="report-section__title">Ocupación</h2>
                <OccupancyDateForm date={occupancyDate} onApply={setOccupancyDate} />
                <p className="report-section__hint" aria-live="polite">Funciones del {formatLongDate(occupancyDate)}.</p>
                <OccupancySection occupancy={occupancy} />
            </section>
        </section>
    );
};

export default ReportsPage;
