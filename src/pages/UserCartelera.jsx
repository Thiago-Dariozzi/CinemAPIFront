import { getActiveMovies } from '../api/movieApi';
import Dashboard from '../components/Movies/Dashboard';

const UserCartelera = () => <Dashboard readOnly fetchAll={getActiveMovies} />;

export default UserCartelera;
