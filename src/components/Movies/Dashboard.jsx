import React, { useState, useEffect } from 'react';
import { getAllMovies, addMovie, deleteMovie, updateMovie } from '../../api/movieApi';
import { getAllGenres } from '../../api/genreApi';
import NewMovie from './NewMovie';
import MovieContainer from './MovieContainer';

const Dashboard = ({ readOnly = false }) => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchMovies();
        getAllGenres(setGenres, (err) => console.error(err));
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
        setSuccess("Película creada correctamente");   
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

    if (loading) return <p className="msg-loading">Cargando películas...</p>;

    return (
        <main className="dashboard">
            {error && (
                <p className="msg-error">
                    {error}
                </p>
            )}
            {success && (
            <p className="msg-success">
                {success}
            </p>
)}
            {!readOnly && <NewMovie onAddMovie={handleAddMovie} />}
             {movies.length === 0 ? <p className="msg-empty">No hay películas cargadas</p> : null}
            <MovieContainer
                movies={movies}
                genres={genres}
                onDeleteMovie={readOnly ? undefined : handleDeleteMovie}
                onEditMovie={readOnly ? undefined : handleUpdateMovie}
            />
        </main>
    );
};

export default Dashboard;