import EntityForm from '../common/EntityForm';
import { screenFields } from './screenFields';

const initialForm = { name: "", rows: 10, seatsPerRow: 12 };

const NewScreen = ({ onAddScreen }) => (
    <EntityForm
        title="Agregar Nueva Sala"
        submitLabel="Guardar Sala"
        fields={screenFields}
        initialValues={initialForm}
        onSubmit={onAddScreen}
    />
);

export default NewScreen;
