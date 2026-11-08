import EntityGrid from '../common/EntityGrid';
import ScreenCard from './ScreenCard';

// Grid of screen cards
const ScreenContainer = ({ screens, onDeleteScreen, onEditScreen }) => (
    <EntityGrid
        items={screens}
        renderItem={(screen) => (
            <ScreenCard
                key={screen.id}
                id={screen.id}
                name={screen.name}
                rows={screen.rows}
                seatsPerRow={screen.seatsPerRow}
                isActive={screen.isActive}
                onDelete={onDeleteScreen}
                onEdit={onEditScreen}
            />
        )}
    />
);

export default ScreenContainer;
