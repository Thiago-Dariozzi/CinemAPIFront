import React, { useMemo } from 'react';
import { useEntityCrud } from '../../hooks/useEntityCrud';
import { useEntityList } from '../../hooks/useEntityList';
import { getAllGenres, addGenre, updateGenre, deleteGenre } from '../../api/genreApi';
import { getAllMovies } from '../../api/movieApi';
import NewGenre from './NewGenre';
import GenreContainer from './GenreContainer';

const GenreDashboard = () => {
    const {
        list: genres,
        loading: isLoading,
        error,
        handleAdd,
        handleUpdate,
        handleDelete,
    } = useEntityCrud({
        fetchAll: getAllGenres,
        addFn: addGenre,
        updateFn: updateGenre,
        deleteFn: deleteGenre,
        messages: { fetchError: "No se pudo conectar con el servidor. ¿Está corriendo el backend?" },
        // Los fallos de alta/edición/borrado se muestran en línea (EntityForm/EntityCard),
        // nunca como banner de página — igual que hoy.
        silentMutationErrors: true,
    });
    const movies = useEntityList(getAllMovies);

    const movieCounts = useMemo(() => {
        const counts = {};
        movies.forEach((m) => {
            counts[m.genreId] = (counts[m.genreId] ?? 0) + 1;
        });
        return counts;
    }, [movies]);

    if (isLoading) return <p className="msg-loading">Cargando géneros...</p>;

    return (
        <main className="dashboard">
            <h1 className="section-title">🎭 Géneros</h1>

            {error && <p className="msg-error">{error}</p>}

            <NewGenre onAddGenre={handleAdd} />

            {genres.length === 0 ? <p className="msg-empty">No hay géneros cargados</p> : null}

            <GenreContainer genres={genres} movieCounts={movieCounts} onEdit={handleUpdate} onDelete={handleDelete} />
        </main>
    );
};

export default GenreDashboard;
