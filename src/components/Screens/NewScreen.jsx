import EntityForm from '../common/EntityForm';
import { screenFields } from './screenFields';

const initialForm = { name: "", capacity: 0 };

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
