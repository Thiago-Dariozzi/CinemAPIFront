import EntityForm from '../common/EntityForm';
import { feeFields } from './feeFields';

const initialForm = { name: "", percentage: "", fixedAmount: "0", isCurrent: false };

const NewFee = ({ onAddFee }) => (
    <EntityForm
        title="Agregar nuevo cargo"
        submitLabel="Guardar cargo"
        submittingLabel="Guardando..."
        fields={feeFields}
        initialValues={initialForm}
        onSubmit={onAddFee}
    />
);

export default NewFee;
