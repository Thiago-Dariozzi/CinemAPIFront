import React from 'react';
import EntityForm from '../common/EntityForm';
import { genreFields } from './genreFields';

const initialForm = { name: "" };

const NewGenre = ({ onAddGenre }) => (
    <EntityForm
        title="Agregar Nuevo Género"
        submitLabel="Guardar Género"
        fields={genreFields}
        initialValues={initialForm}
        onSubmit={onAddGenre}
    />
);

export default NewGenre;
