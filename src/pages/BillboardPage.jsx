import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getActiveMovies } from '../api/movieApi';
import { getAllGenres } from '../api/genreApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { isDateKey, nextDateKeys } from '../utils/dates';
import BillboardFilters from '../components/Billboard/BillboardFilters';
import PosterCard from '../components/Billboard/PosterCard';
import { EmptyState, ErrorState, LoadingState } from '../components/common/LoadState';

const DAYS_AHEAD = 7;
const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BillboardPage = () => {
    const [params, setParams] = useSearchParams();
    const [today] = useState(() => new Date());
    const dateKeys = nextDateKeys(DAYS_AHEAD, today);
    const genreParam = params.get('genero') ?? "";
    const dateParam = params.get('fecha') ?? "";
    const genreId = GUID_PATTERN.test(genreParam) ? genreParam : "";
    const date = isDateKey(dateParam) && dateKeys.includes(dateParam) ? dateParam : "";

    const fetchMovies = useCallback(() => getActiveMovies({ genreId, date }), [genreId, date]);
    const movies = useAsyncData(fetchMovies, "No pudimos cargar la cartelera.");
    const genres = useAsyncData(getAllGenres, "No pudimos cargar los géneros.");

    const setFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        setParams(next);
    };
    const clearFilters = () => setParams(new URLSearchParams());

    const genreName = (id) => (genres.data ?? []).find((genre) => genre.id === id)?.name;
    const detailPath = (movieId) => `/cartelera/${movieId}${date ? `?dia=${date}` : ""}`;
    const hasFilters = Boolean(genreId || date);

    return (
        <section className="billboard">
            <header className="billboard__hero">
                <p className="billboard__eyebrow">En cartelera</p>
                <h1 className="billboard__title">¿Qué vas a ver hoy?</h1>
                <p className="billboard__subtitle">Elegí la película, el día y la función. Reservás tus butacas en un par de clics.</p>
            </header>

            <BillboardFilters
                genres={genres.data ?? []}
                dateKeys={dateKeys}
                today={today}
                genreId={genreId}
                date={date}
                onGenreChange={(value) => setFilter('genero', value)}
                onDateChange={(value) => setFilter('fecha', value)}
            />
            {genres.error && <p className="msg-inline-error">{genres.error} Podés seguir viendo la cartelera sin filtrar por género.</p>}

            {movies.loading && <LoadingState message="Cargando la cartelera..." />}
            {movies.error && <ErrorState message={movies.error} onRetry={movies.reload} />}
            {movies.data?.length === 0 && (
                <EmptyState title={hasFilters ? "No hay películas con esos filtros." : "Todavía no hay películas en cartelera."}>
                    {hasFilters && <button type="button" className="btn btn--outline-gold" onClick={clearFilters}>Ver toda la cartelera</button>}
                </EmptyState>
            )}
            {movies.data?.length > 0 && (
                <div className="poster-grid">
                    {movies.data.map((movie) => (
                        <PosterCard key={movie.id} movie={movie} genreName={genreName(movie.genreId)} detailPath={detailPath(movie.id)} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default BillboardPage;
