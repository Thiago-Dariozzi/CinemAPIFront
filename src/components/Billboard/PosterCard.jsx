import { Link } from 'react-router-dom';
import { formatDuration } from '../../utils/dates';
import MoviePoster from './MoviePoster';

const PosterCard = ({ movie, genreName, detailPath }) => (
    <Link to={detailPath} className="poster-card">
        <div className="poster-card__frame">
            <MoviePoster key={movie.imageUrl} src={movie.imageUrl} title={movie.title} className="poster-card__image" decorative />
            <span className="poster-card__cta" aria-hidden="true">Ver horarios</span>
        </div>
        <div className="poster-card__body">
            <h2 className="poster-card__title">{movie.title}</h2>
            <p className="poster-card__meta">
                {genreName && <span className="genre-tag">{genreName}</span>}
                <span>{formatDuration(movie.durationMinutes)}</span>
            </p>
        </div>
    </Link>
);

export default PosterCard;
