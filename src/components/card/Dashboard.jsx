import React, { useState, useEffect } from 'react';
import { getAllMovies, addMovie, deleteMovie } from '../../api/movieApi';
import NewMovie from './NewMovie';
import MovieContainer from './MovieContainer';

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const data = await getAllMovies();
            setMovies(data);
            setError(null);
        } catch (err) {
            setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMovie = async (movie) => {
        try {
            const created = await addMovie(movie);
            setMovies((prev) => [created, ...prev]);
        } catch (err) {
            setError("Error al agregar la película");
            console.error(err);
        }
    };

    const handleDeleteMovie = async (id) => {
        try {
            await deleteMovie(id);
            setMovies((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            setError("Error al eliminar la película");
            console.error(err);
        }
    };

    if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Cargando películas...</p>;

    return (
        <main style={{ padding: '0 20px' }}>
            {error && (
                <p style={{ color: '#e74c3c', textAlign: 'center', padding: '10px',
                    backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #e74c3c' }}>
                    {error}
                </p>
            )}
            <NewMovie onAddMovie={handleAddMovie} />
            <MovieContainer movies={movies} onDeleteMovie={handleDeleteMovie} />
        </main>
    );
};

export default Dashboard;