import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import ProtectedRoute from './auth/ProtectedRoute'
import { getSession } from './auth/session'
import AppLayout from './components/Layout/AppLayout'

// Admin pages (cada dashboard existente)
import Dashboard from './components/Movies/Dashboard'
import GenreDashboard from './components/Genres/GenreDashboard'
import ScreenDashboard from './components/Screens/ScreenDashboard'
import TicketDashboard from './components/Tickets/TicketDashboard'
import UserDashboard from './components/Users/UserDashboard'

// User pages
import UserCartelera from './pages/UserCartelera'
import UserTickets from './pages/UserTickets'

const HomeRedirect = () => {
  const session = getSession()
  if (!session) return <Navigate to="/login" replace />
  return <Navigate to={session.role === "Admin" ? "/admin/peliculas" : "/panel/cartelera"} replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas Admin */}
        <Route path="/admin" element={<ProtectedRoute role="Admin"><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="peliculas" replace />} />
          <Route path="peliculas" element={<Dashboard />} />
          <Route path="generos" element={<GenreDashboard />} />
          <Route path="salas" element={<ScreenDashboard />} />
          <Route path="tickets" element={<TicketDashboard />} />
          <Route path="usuarios" element={<UserDashboard />} />
        </Route>

        {/* Rutas Usuario */}
        <Route path="/panel" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="cartelera" replace />} />
          <Route path="cartelera" element={<UserCartelera />} />
          <Route path="mis-tickets" element={<UserTickets />} />
        </Route>

        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
