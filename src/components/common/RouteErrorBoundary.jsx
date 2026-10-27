import { Component } from 'react';
import { ErrorState } from './LoadState';

class RouteErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { failed: false };
    }

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error) {
        console.error(error);
    }

    render() {
        if (this.state.failed) {
            return (
                <ErrorState
                    message="No se pudo abrir esta pantalla. Puede que haya una versión nueva de la página."
                    onRetry={() => window.location.reload()}
                />
            );
        }
        return this.props.children;
    }
}

export default RouteErrorBoundary;
