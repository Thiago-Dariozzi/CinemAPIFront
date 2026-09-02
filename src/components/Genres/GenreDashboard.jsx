import React, { useState, useEffect, useMemo } from 'react';
import { getAllGenres } from '../../api/genreApi';
import { getAllMovies } from '../../api/movieApi';
import NewGenre from './NewGenre';
import GenreContainer from './GenreContainer';

const GenreDashboard = () => {
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        getAllGenres(
            (data) => { setGenres(data); setIsLoading(false); },
            (err) => {
                console.error(err);
                setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
                setIsLoading(false);
            }
        );

        getAllMovies().then(setMovies).catch((err) => console.error(err));
    }, []);

    const movieCounts = useMemo(() => {
        const counts = {};
        movies.forEach((m) => {
            counts[m.genreId] = (counts[m.genreId] ?? 0) + 1;
        });
        return counts;
    }, [movies]);

    const handleAdded = (genre) => {
        setGenres((prev) => [genre, ...prev]);
    };

    const handleUpdated = (id, updated) => {
        setGenres((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    };

    const handleDeleted = (id) => {
        setGenres((prev) => prev.filter((g) => g.id !== id));
    };

    if (isLoading) return <p className="msg-loading">Cargando géneros...</p>;

    return (
        <main className="dashboard">
            <h1 className="section-title">🎭 Géneros</h1>

            {error && (
                <p className="msg-error">
                    {error}
                </p>
            )}

            <NewGenre onAdded={handleAdded} />

            {genres.length === 0 ? <p className="msg-empty">No hay géneros cargados</p> : null}

            <GenreContainer
                genres={genres}
                movieCounts={movieCounts}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
            />
        </main>
    );
};

export default GenreDashboard;
