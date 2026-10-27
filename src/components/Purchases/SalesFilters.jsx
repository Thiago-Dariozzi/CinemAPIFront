const STATUS_OPTIONS = [
    { value: "", label: "Todas" },
    { value: "Confirmed", label: "Confirmadas" },
    { value: "Cancelled", label: "Canceladas" },
];

const showtimeLabel = (showtime) =>
    new Date(showtime.startTime).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const SalesFilters = ({ filters, movies, showtimes, onChange, onClear }) => {
    const handle = (key) => (event) => onChange(key, event.target.value);

    return (
        <form className="form-panel sales-filters" onSubmit={(event) => event.preventDefault()}>
            <div className="sales-filters__grid">
                <div>
                    <label className="form-label" htmlFor="sales-movie">Película</label>
                    <select id="sales-movie" className="form-select" value={filters.movieId} onChange={handle('movieId')}>
                        <option value="">Todas</option>
                        {movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label" htmlFor="sales-showtime">Función</label>
                    <select
                        id="sales-showtime"
                        className="form-select"
                        value={filters.showtimeId}
                        onChange={handle('showtimeId')}
                        disabled={!filters.movieId}
                    >
                        <option value="">{filters.movieId ? "Todas" : "Elegí una película"}</option>
                        {showtimes.map((showtime) => <option key={showtime.id} value={showtime.id}>{showtimeLabel(showtime)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label" htmlFor="sales-from">Vendidas desde</label>
                    <input id="sales-from" type="date" className="form-input" value={filters.from} onChange={handle('from')} />
                </div>
                <div>
                    <label className="form-label" htmlFor="sales-to">Hasta</label>
                    <input id="sales-to" type="date" className="form-input" value={filters.to} onChange={handle('to')} />
                </div>
                <div>
                    <label className="form-label" htmlFor="sales-status">Estado</label>
                    <select id="sales-status" className="form-select" value={filters.status} onChange={handle('status')}>
                        {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </div>
            </div>
            <button type="button" className="btn btn--cancel btn-group" onClick={onClear}>Limpiar filtros</button>
        </form>
    );
};

export default SalesFilters;
