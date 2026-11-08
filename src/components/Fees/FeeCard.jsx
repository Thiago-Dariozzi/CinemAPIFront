import EntityCard from '../common/EntityCard';
import { feeFields, feeConfirmDeleteMessage, renderFeeView } from './feeFields';

// Editable card for a fee
const FeeCard = ({ id, name, percentage, fixedAmount, isCurrent, onDelete, onEdit }) => (
    <EntityCard
        id={id}
        values={{ name, percentage: String(percentage), fixedAmount: String(fixedAmount), isCurrent }}
        fields={feeFields}
        renderView={renderFeeView}
        confirmDeleteMessage={feeConfirmDeleteMessage}
        onEdit={onEdit}
        onDelete={onDelete}
    />
);

export default FeeCard;
