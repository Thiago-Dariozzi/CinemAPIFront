import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getMovieById, getMovieSchedule } from '../api/movieApi';
import { getAllGenres } from '../api/genreApi';
import { ROLES, isStaff } from '../auth/roles';
import { useAsyncData } from '../hooks/useAsyncData';
import { useSession } from '../hooks/useSession';
import { formatDuration, formatReleaseDate } from '../utils/dates';
import MoviePoster from '../components/Billboard/MoviePoster';
import ShowtimeSchedule from '../components/Billboard/ShowtimeSchedule';
import { EmptyState, ErrorState, LoadingState } from '../components/common/LoadState';

const LOGIN_NOTICE = "Ingresá o creá tu cuenta para comprar entradas. Después volvés a esta película.";

const MovieSchedule = ({ movie, schedule, today, selectedDate, onSelectDate, onBuy, canBuy, staffHint }) => {
    if (!movie.isShowing) return <EmptyState title="Esta película no está en cartelera." />;
    if (schedule.loading) return <LoadingState message="Buscando funciones..." />;
    if (schedule.error) return <ErrorState message={schedule.error} onRetry={schedule.reload} />;
    if (schedule.data.length === 0) {
        return (
            <EmptyState title="Por ahora no hay funciones programadas.">
                <Link to="/cartelera" className="btn btn--outline-gold">Ver otras películas</Link>
            </EmptyState>
        );
    }

    return (
        <>
            {staffHint && <p className="msg-info">{staffHint}</p>}
            <ShowtimeSchedule
                days={schedule.data}
                selectedDate={selectedDate}
                today={today}
                canBuy={canBuy}
                onSelectDate={onSelectDate}
                onBuy={onBuy}
            />
        </>
    );
};

const MovieDetailPage = () => {
    const { movieId } = useParams();
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const session = useSession();
    const [today] = useState(() => new Date());
    const selectedDate = params.get('dia');
    const selectDate = (date) => setParams({ dia: date }, { replace: true });

    const fetchMovie = useCallback(() => getMovieById(movieId), [movieId]);
    const fetchSchedule = useCallback(() => getMovieSchedule(movieId), [movieId]);
    const movie = useAsyncData(fetchMovie, "No pudimos cargar la película.");
    const schedule = useAsyncData(fetchSchedule, "No pudimos cargar los horarios.");
    const genres = useAsyncData(getAllGenres, "No pudimos cargar los géneros.");

    if (movie.loading) return <LoadingState message="Cargando la película..." />;
    if (movie.error) {
        return (
            <>
                <Link to="/cartelera" className="back-link">← Volver a la cartelera</Link>
                {movie.errorStatus === 404
                    ? <EmptyState title="No encontramos esa película. Puede que ya no esté en cartelera." />
                    : <ErrorState message={movie.error} onRetry={movie.reload} />}
            </>
        );
    }

    const data = movie.data;
    const genreName = (genres.data ?? []).find((genre) => genre.id === data.genreId)?.name;
    const releaseDate = formatReleaseDate(data.releaseDate);
    const staffHint = session && isStaff(session.role)
        ? "Entraste como staff: la compra de entradas es para clientes."
        : null;

    const handleBuy = (showtime, date) => {
        if (!session) {
            navigate('/login', { state: { from: `/cartelera/${movieId}?dia=${date}`, notice: LOGIN_NOTICE } });
            return;
        }
        navigate(`/panel/funciones/${showtime.id}/comprar`);
    };

    return (
        <article className="movie-detail">
            <Link to="/cartelera" className="back-link">← Volver a la cartelera</Link>

            <div className="movie-detail__hero">
                <MoviePoster key={data.imageUrl} src={data.imageUrl} title={data.title} className="movie-detail__poster" />
                <div className="movie-detail__info">
                    <h1 className="movie-detail__title">{data.title}</h1>
                    <ul className="movie-detail__facts">
                        {genreName && <li><span className="genre-tag">{genreName}</span></li>}
                        <li>⏱️ {formatDuration(data.durationMinutes)}</li>
                        {releaseDate && <li>📅 Estreno: {releaseDate}</li>}
                    </ul>
                    <p className="movie-detail__synopsis">{data.synopsis || "Sin sinopsis disponible."}</p>
                </div>
            </div>

            <section className="movie-detail__schedule" aria-labelledby="horarios">
                <h2 id="horarios" className="movie-detail__section-title">Horarios</h2>
                <MovieSchedule
                    movie={data}
                    schedule={schedule}
                    today={today}
                    selectedDate={selectedDate}
                    onSelectDate={selectDate}
                    onBuy={handleBuy}
                    canBuy={!session || session.role === ROLES.client}
                    staffHint={staffHint}
                />
            </section>
        </article>
    );
};

export default MovieDetailPage;
