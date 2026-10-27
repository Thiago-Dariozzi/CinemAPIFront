import EntityGrid from '../common/EntityGrid';
import PurchaseCard from './PurchaseCard';

const PurchaseList = ({ purchases, showCustomer, cancelHint, onCancel }) => (
    <EntityGrid
        items={purchases}
        renderItem={(purchase) => (
            <PurchaseCard
                key={purchase.id}
                purchase={purchase}
                showCustomer={showCustomer}
                cancelHint={cancelHint}
                onCancel={onCancel}
            />
        )}
    />
);

export default PurchaseList;
