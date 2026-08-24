import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import ProtectedRoute from './auth/ProtectedRoute'
import { getSession } from './auth/session'
import AdminPanel from './pages/AdminPanel'
import UserPanel from './pages/UserPanel'

const HomeRedirect = () => {
  const session = getSession()
  if (!session) return <Navigate to="/login" replace />
  return <Navigate to={session.role === "Admin" ? "/admin" : "/panel"} replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/panel" element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
