import LazyOutlet from './LazyOutlet';
import Sidebar from './Sidebar';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="app-layout__content">
                <LazyOutlet />
            </main>
        </div>
    );
};

export default AppLayout;
