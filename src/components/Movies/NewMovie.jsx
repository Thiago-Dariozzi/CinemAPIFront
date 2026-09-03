import React from 'react';
import EntityForm from '../common/EntityForm';
import { movieFormFields } from './movieFields';
import { initialForm } from './NewMovieData';
import { useEntityList } from '../../hooks/useEntityList';
import { getAllGenres } from '../../api/genreApi';

const NewMovie = ({ onAddMovie }) => {
    const genres = useEntityList(getAllGenres);

    return (
        <EntityForm
            title="Agregar Nueva Película"
            submitLabel="Guardar Película"
            fields={movieFormFields}
            initialValues={initialForm}
            optionsSources={{ genres }}
            onSubmit={async (payload) => {
                try {
                    await onAddMovie(payload);
                } catch {
                    // Error is shown at page level by Dashboard.
                }
            }}
        />
    );
};

export default NewMovie;
