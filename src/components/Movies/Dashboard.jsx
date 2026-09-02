import React from 'react';
import { useEntityCrud } from '../../hooks/useEntityCrud';
import { useEntityList } from '../../hooks/useEntityList';
import { getAllMovies, addMovie, deleteMovie, updateMovie } from '../../api/movieApi';
import { getAllGenres } from '../../api/genreApi';
import { promisify } from '../../utils/promisify';
import NewMovie from './NewMovie';
import MovieContainer from './MovieContainer';

const fetchAllGenres = promisify(getAllGenres);

const Dashboard = ({ readOnly = false }) => {
    const { list: movies, loading, error, success, handleAdd, handleUpdate, handleDelete } = useEntityCrud({
        fetchAll: getAllMovies,
        addFn: addMovie,
        updateFn: updateMovie,
        deleteFn: deleteMovie,
        messages: {
            fetchError: "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
            addSuccess: "Película creada correctamente",
            addError: "Error al agregar la película",
            updateError: "Error al actualizar la película",
            deleteError: "Error al eliminar la película",
        },
    });
    const genres = useEntityList(fetchAllGenres);

    if (loading) return <p className="msg-loading">Cargando películas...</p>;

    return (
        <main className="dashboard">
            {error && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
            {!readOnly && <NewMovie onAddMovie={handleAdd} />}
            {movies.length === 0 ? <p className="msg-empty">No hay películas cargadas</p> : null}
            <MovieContainer
                movies={movies}
                genres={genres}
                onDeleteMovie={readOnly ? undefined : handleDelete}
                onEditMovie={readOnly ? undefined : handleUpdate}
            />
        </main>
    );
};

export default Dashboard;
