import { getActiveMovies } from '../api/movieApi';
import Dashboard from '../components/Movies/Dashboard';

const movieShowtimesPath = (movieId) => `/panel/peliculas/${movieId}`;

const UserCartelera = () => <Dashboard readOnly fetchAll={getActiveMovies} detailPathFor={movieShowtimesPath} />;

export default UserCartelera;
