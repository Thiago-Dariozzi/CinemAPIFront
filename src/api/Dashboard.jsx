import React, { useState, useEffect } from 'react';
import { getAllMovies, addMovie, deleteMovie, updateMovie } from './MoviesApi/movieApi';
import NewMovie from './MoviesApi/NewMovie';
import MovieContainer from './MoviesApi/MovieContainer';

// readOnly: el panel de Usuario lo usa así — un cliente puede mirar el catálogo pero
// no dar de alta/editar/borrar películas, eso queda para el panel de Admin.
const Dashboard = ({ readOnly = false }) => {
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

    const handleUpdateMovie = async (id, movie) => {
        try {
            await updateMovie(id, movie);
            setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...movie } : m)));
        } catch (err) {
            setError("Error al actualizar la película");
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
            {!readOnly && <NewMovie onAddMovie={handleAddMovie} />}
            <MovieContainer
                movies={movies}
                onDeleteMovie={readOnly ? undefined : handleDeleteMovie}
                onEditMovie={readOnly ? undefined : handleUpdateMovie}
            />
        </main>
    );
};

export default Dashboard;