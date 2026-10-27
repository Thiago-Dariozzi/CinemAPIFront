import EntityForm from '../common/EntityForm';
import { createUserFields } from './userFields';

const initialForm = { name: "", email: "", password: "" };

const NewUser = ({ title, role, onAddUser }) => (
    <EntityForm
        title={title}
        submitLabel="Guardar usuario"
        submittingLabel="Guardando..."
        fields={createUserFields}
        initialValues={initialForm}
        onSubmit={(values) => onAddUser({ ...values, role })}
    />
);

export default NewUser;
