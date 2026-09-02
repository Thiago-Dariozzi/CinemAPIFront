import React from 'react';

// Wrapper genérico: .map() sobre una lista de items dentro de un grid.
const EntityGrid = ({ items, renderItem, className = 'entity-grid' }) => (
    <div className={className}>
        {items.map(renderItem)}
    </div>
);

export default EntityGrid;
