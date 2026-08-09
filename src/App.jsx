import React, { useState } from 'react'
import { MOVIES } from './moviesData'
import MovieContainer from './components/card/MovieContainer'
import NewMovie from './components/card/NewMovie'
import Dashboard from './components/card/Dashboard'

const App = () => {
  const [movies, setMovies] = useState(MOVIES) 
  
  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">🎥 CinemAPI</h1>
      </header>
      <Dashboard />
    </div>
  )
}

export default App