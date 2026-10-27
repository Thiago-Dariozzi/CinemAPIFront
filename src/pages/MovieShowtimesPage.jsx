import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieById } from '../api/movieApi';
import { getUpcomingShowtimes } from '../api/showtimeApi';
import { getAllScreens } from '../api/screenApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { formatMoney } from '../utils/money';

const dayKey = (startTime) => new Date(startTime).toDateString();

const dayTitle = (startTime) =>
    new Date(startTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

const timeOf = (startTime) =>
    new Date(startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

const groupByDay = (showtimes) => {
    const groups = new Map();
    showtimes.forEach((showtime) => {
        const key = dayKey(showtime.startTime);
        groups.set(key, [...(groups.get(key) ?? []), showtime]);
    });
    return [...groups.values()];
};

const MovieShowtimesPage = () => {
    const { movieId } = useParams();
    const fetchMovie = useCallback(() => getMovieById(movieId), [movieId]);
    const fetchShowtimes = useCallback(() => getUpcomingShowtimes(movieId), [movieId]);
    const movie = useAsyncData(fetchMovie, "No se pudo cargar la película.");
    const showtimes = useAsyncData(fetchShowtimes, "No se pudieron cargar las funciones.");
    const screens = useAsyncData(getAllScreens, "No se pudieron cargar las salas; se muestran sin nombre.");

    if (movie.loading || showtimes.loading) return <p className="msg-loading">Cargando funciones...</p>;
    if (movie.error || showtimes.error) return <p className="msg-error">{movie.error ?? showtimes.error}</p>;

    const screenName = (screenId) => (screens.data ?? []).find((s) => s.id === screenId)?.name ?? "Sala";
    const days = groupByDay(showtimes.data);

    return (
        <main className="dashboard">
            <Link to="/panel/cartelera" className="back-link">← Volver a la cartelera</Link>
            <h1 className="section-title">🎬 {movie.data.title}</h1>
            <p className="functions-muted">{movie.data.durationMinutes} min</p>
            {screens.error && <p className="msg-error">{screens.error}</p>}

            {!movie.data.isShowing && <p className="msg-error">Esta película no está en cartelera.</p>}
            {movie.data.isShowing && days.length === 0 && <p className="msg-empty">No hay funciones próximas para esta película.</p>}

            {movie.data.isShowing && days.map((day) => (
                <section key={dayKey(day[0].startTime)} className="showtime-day">
                    <h2 className="showtime-day__title">{dayTitle(day[0].startTime)}</h2>
                    <div className="showtime-day__list">
                        {day.map((showtime) => (
                            <Link key={showtime.id} to={`/panel/funciones/${showtime.id}/comprar`} className="showtime-option">
                                <span className="showtime-option__time">{timeOf(showtime.startTime)}</span>
                                <span>{screenName(showtime.screenId)}</span>
                                <span>{formatMoney(showtime.price)}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
};

export default MovieShowtimesPage;
