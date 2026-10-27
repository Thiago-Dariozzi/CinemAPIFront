import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ProtectedRoute from './auth/ProtectedRoute'
import { ROLES, STAFF_ROLES, homePathFor } from './auth/roles'
import { useSession } from './hooks/useSession'
import AppLayout from './components/Layout/AppLayout'

// Admin pages (cada dashboard existente)
import Dashboard from './components/Movies/Dashboard'
import GenreDashboard from './components/Genres/GenreDashboard'
import ScreenDashboard from './components/Screens/ScreenDashboard'
import UserDashboard from './components/Users/UserDashboard'
import FeesPage from './pages/FeesPage'
import SalesPage from './pages/SalesPage'
import Profile from './pages/Profile'

// User pages
import UserCartelera from './pages/UserCartelera'
import MovieShowtimesPage from './pages/MovieShowtimesPage'
import PurchasePage from './pages/PurchasePage'
import MyPurchases from './pages/MyPurchases'

const HomeRedirect = () => {
  const session = useSession()
  return <Navigate to={session ? homePathFor(session.role) : "/login"} replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={STAFF_ROLES}><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="peliculas" replace />} />
          <Route path="peliculas" element={<Dashboard />} />
          <Route path="generos" element={<GenreDashboard />} />
          <Route path="salas" element={<ScreenDashboard />} />
          <Route path="ventas" element={<SalesPage />} />
          <Route path="clientes" element={<UserDashboard key={ROLES.client} role={ROLES.client} />} />
          <Route
            path="administradores"
            element={<ProtectedRoute roles={[ROLES.superAdmin]}><UserDashboard key={ROLES.admin} role={ROLES.admin} /></ProtectedRoute>}
          />
          <Route path="cargos" element={<ProtectedRoute roles={[ROLES.superAdmin]}><FeesPage /></ProtectedRoute>} />
          <Route path="perfil" element={<Profile />} />
        </Route>

        {/* Rutas Usuario */}
        <Route path="/panel" element={<ProtectedRoute roles={[ROLES.client]}><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="cartelera" replace />} />
          <Route path="cartelera" element={<UserCartelera />} />
          <Route path="peliculas/:movieId" element={<MovieShowtimesPage />} />
          <Route path="funciones/:showtimeId/comprar" element={<PurchasePage />} />
          <Route path="mis-entradas" element={<MyPurchases />} />
          <Route path="perfil" element={<Profile />} />
        </Route>

        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
