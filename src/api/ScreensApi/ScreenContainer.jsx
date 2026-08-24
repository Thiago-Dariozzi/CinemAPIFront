import React from 'react';
import ScreenCard from './ScreenCard';

const ScreenContainer = ({ screens, onDeleteScreen, onEditScreen }) => {
    const screensMapped = screens.map((screen) => (
        <ScreenCard
            key={screen.id}
            id={screen.id}
            name={screen.name}
            capacity={screen.capacity}
            isActive={screen.isActive}
            onDelete={onDeleteScreen}
            onEdit={onEditScreen}
        />
    ));

    return (
        <div className="screens-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            padding: '20px 0'
        }}>
            {screensMapped}
        </div>
    );
};

export default ScreenContainer;
