import EntityGrid from '../common/EntityGrid';
import FeeCard from './FeeCard';

const FeeContainer = ({ fees, onDeleteFee, onEditFee }) => (
    <EntityGrid
        items={fees}
        renderItem={(fee) => (
            <FeeCard
                key={fee.id}
                id={fee.id}
                name={fee.name}
                percentage={fee.percentage}
                fixedAmount={fee.fixedAmount}
                isCurrent={fee.isCurrent}
                onDelete={onDeleteFee}
                onEdit={onEditFee}
            />
        )}
    />
);

export default FeeContainer;
