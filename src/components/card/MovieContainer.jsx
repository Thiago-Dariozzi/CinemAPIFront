import React from 'react'
import MovieCard from './MovieCard';
import { MOVIES } from '../../MoviesData';

const MovieContainer = ({movies}) => {

  const moviesMapped = movies.map((movie) => (
    <MovieCard
    key={movie.id}
    title={movie.title}
    synopsis={movie.synopsis}
    durationMinutes={movie.durationMinutes} 
    genre={movie.genre}
    imageUrl={movie.imageUrl}
    releaseDate={movie.releaseDate}
    isActive={movie.isActive}
    />
  ));

return (
    <div className="movies-grid">
      {moviesMapped}
    </div>
  )
}

export default MovieContainer


