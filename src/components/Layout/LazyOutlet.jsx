import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import RouteErrorBoundary from '../common/RouteErrorBoundary';
import { LoadingState } from '../common/LoadState';

const LazyOutlet = () => {
    const location = useLocation();

    return (
        <RouteErrorBoundary key={location.pathname}>
            <Suspense fallback={<LoadingState message="Cargando..." />}>
                <Outlet />
            </Suspense>
        </RouteErrorBoundary>
    );
};

export default LazyOutlet;
