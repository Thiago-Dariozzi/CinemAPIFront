import React, { useState, useEffect, useMemo } from 'react';
import { getAllGenres } from './genreApi';
import { getAllMovies } from '../MoviesApi/movieApi';
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

        // El backend no expone un conteo de películas por género, así que se trae la
        // lista completa (una sola vez acá, no por tarjeta) y se cuenta del lado del
        // cliente — mismo criterio que ya usa MovieFunctionsPanel para resolver nombres
        // cruzando listas traídas por separado.
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

    if (isLoading) return <p style={{ color: 'white', textAlign: 'center' }}>Cargando géneros...</p>;

    return (
        <main style={{ padding: '0 20px' }}>
            <h1 style={{ color: '#ffbd59' }}>🎭 Géneros</h1>

            {error && (
                <p style={{ color: '#e74c3c', textAlign: 'center', padding: '10px',
                    backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #e74c3c' }}>
                    {error}
                </p>
            )}

            <NewGenre onAdded={handleAdded} />

            {genres.length === 0 ? <p style={{ color: 'white', textAlign: 'center' }}>No hay géneros cargados</p> : null}

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
