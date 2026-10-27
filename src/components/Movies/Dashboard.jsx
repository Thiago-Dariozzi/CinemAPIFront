import { useEntityCrud } from '../../hooks/useEntityCrud';
import { useEntityList } from '../../hooks/useEntityList';
import { getAllMovies, addMovie, deleteMovie, updateMovie } from '../../api/movieApi';
import { getAllGenres } from '../../api/genreApi';
import NewMovie from './NewMovie';
import MovieContainer from './MovieContainer';

const Dashboard = ({ readOnly = false, fetchAll = getAllMovies, detailPathFor }) => {
    const { list: movies, loading, error, success, handleAdd, handleUpdate, handleDelete } = useEntityCrud({
        fetchAll,
        addFn: addMovie,
        updateFn: updateMovie,
        deleteFn: deleteMovie,
        messages: {
            fetchError: "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
            addSuccess: "Película creada correctamente",
        },
        silentMutationErrors: true,
    });
    const genres = useEntityList(getAllGenres);

    if (loading) return <p className="msg-loading">Cargando películas...</p>;

    return (
        <main className="dashboard">
            <h1 className="section-title">{readOnly ? '🎬 Cartelera' : '🎬 Películas'}</h1>
            {error && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
            {!readOnly && <NewMovie onAddMovie={handleAdd} />}
            {movies.length === 0 ? <p className="msg-empty">No hay películas cargadas</p> : null}
            <MovieContainer
                movies={movies}
                genres={genres}
                detailPathFor={detailPathFor}
                onDeleteMovie={readOnly ? undefined : handleDelete}
                onEditMovie={readOnly ? undefined : handleUpdate}
            />
        </main>
    );
};

export default Dashboard;
