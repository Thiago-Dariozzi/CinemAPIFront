import { useState } from 'react';

const MoviePoster = ({ src, title, className = "", decorative = false }) => {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!src || failedSrc === src) {
        return (
            <div
                className={`movie-poster movie-poster--fallback ${className}`}
                {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": `Afiche de ${title}` })}
            >
                <span className="movie-poster__icon" aria-hidden="true">🎬</span>
                <span className="movie-poster__title">{title}</span>
            </div>
        );
    }

    return (
        <img
            className={`movie-poster ${className}`}
            src={src}
            alt={decorative ? "" : `Afiche de ${title}`}
            loading="lazy"
            onError={() => setFailedSrc(src)}
        />
    );
};

export default MoviePoster;
