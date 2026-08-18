import React from 'react'
import MOVIES from '../../MoviesData'
import NewMovie from './NewMovie';
import MovieContainer from './MovieContainer';
import MovieCard from './MovieCard';
import { useState } from 'react';

const Dashboard = () => {
    
    const [movies, setMovies] = useState(MOVIES);

    const handleAddMovie = (movie) => {
        setMovies((prevMovies) =>[{
            ...movie,
            id: Math.max(...prevMovies.map(movie => movie.id)) + 1
        },...prevMovies
    ])}

  return (
    <main style={{ padding: '0 20px' }}>

    <NewMovie onAddMovie={handleAddMovie}/>
    <MovieContainer movies={movies}/>
    </main>