import { Navigate, useParams } from 'react-router-dom';

const LegacyMovieRedirect = () => {
    const { movieId } = useParams();
    return <Navigate to={`/cartelera/${movieId}`} replace />;
};

export default LegacyMovieRedirect;
