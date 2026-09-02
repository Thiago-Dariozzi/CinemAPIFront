import React from 'react';
import EntityGrid from '../common/EntityGrid';
import ScreenCard from './ScreenCard';

const ScreenContainer = ({ screens, onDeleteScreen, onEditScreen }) => (
    <EntityGrid
        items={screens}
        renderItem={(screen) => (
            <ScreenCard
                key={screen.id}
                id={screen.id}
                name={screen.name}
                capacity={screen.capacity}
                isActive={screen.isActive}
                onDelete={onDeleteScreen}
                onEdit={onEditScreen}
            />
        )}
    />
);

export default ScreenContainer;
