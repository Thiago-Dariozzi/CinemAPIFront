import { Spinner } from 'react-bootstrap';

// Loading spinner with a message
export const LoadingState = ({ message }) => (
    <div className="state-block" role="status">
        <Spinner animation="border" className="state-block__spinner" aria-hidden="true" />
        <p>{message}</p>
    </div>
);

// Error message with optional retry
export const ErrorState = ({ message, onRetry }) => (
    <div className="state-block state-block--error" role="alert">
        <p>{message}</p>
        {onRetry && <button type="button" className="btn btn--primary" onClick={onRetry}>Reintentar</button>}
    </div>
);

// Empty state message
export const EmptyState = ({ title, children }) => (
    <div className="state-block">
        <p className="state-block__title">{title}</p>
        {children}
    </div>
);
