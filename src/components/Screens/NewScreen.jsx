import React from 'react';
import EntityForm from '../common/EntityForm';
import { screenFields } from './screenFields';

const initialForm = { name: "", capacity: 0 };

const NewScreen = ({ onAddScreen }) => (
    <EntityForm
        title="Agregar Nueva Sala"
        submitLabel="Guardar Sala"
        fields={screenFields}
        initialValues={initialForm}
        onSubmit={async (payload) => {
            try {
                await onAddScreen(payload);
            } catch {
                // ScreenDashboard.jsx ya muestra el error a nivel página (msg-error).
            }
        }}
    />
);

export default NewScreen;
