import { Navigate, useParams } from 'react-router-dom';

// Redirects the old movie route to the billboard
const LegacyMovieRedirect = () => {
    const { movieId } = useParams();
    return <Navigate to={`/cartelera/${movieId}`} replace />;
};

export default LegacyMovieRedirect;
