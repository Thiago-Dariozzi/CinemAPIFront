import React from 'react'
import Dashboard from './api/MoviesApi/Dashboard'
import ScreenDashboard from './api/ScreensApi/ScreenDashboard'

const App = () => {
  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">🎥 CinemAPI</h1>
      </header>
      <Dashboard />
      <ScreenDashboard />
    </div>
  )
}

export default App
