import React from 'react';
const EntityGrid = ({ items, renderItem, className = 'entity-grid' }) => (
    <div className={className}>
        {items.map(renderItem)}
    </div>
);

export default EntityGrid;
