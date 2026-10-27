import { lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import ProtectedRoute from './auth/ProtectedRoute'
import { ROLES, STAFF_ROLES, homePathFor } from './auth/roles'
import { useSession } from './hooks/useSession'
import AppLayout from './components/Layout/AppLayout'
import PublicLayout from './components/Layout/PublicLayout'
import LegacyMovieRedirect from './components/routes/LegacyMovieRedirect'

import BillboardPage from './pages/BillboardPage'
import MovieDetailPage from './pages/MovieDetailPage'

// Admin pages (cada dashboard existente)
// Loaded on demand so the public billboard ships a small bundle.
const Dashboard = lazy(() => import('./components/Movies/Dashboard'))
const GenreDashboard = lazy(() => import('./components/Genres/GenreDashboard'))
const ScreenDashboard = lazy(() => import('./components/Screens/ScreenDashboard'))
const UserDashboard = lazy(() => import('./components/Users/UserDashboard'))
const FeeDashboard = lazy(() => import('./components/Fees/FeeDashboard'))
const SalesPage = lazy(() => import('./pages/SalesPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const Profile = lazy(() => import('./pages/Profile'))

// User pages
const PurchasePage = lazy(() => import('./pages/PurchasePage'))
const MyPurchases = lazy(() => import('./pages/MyPurchases'))

const HomeRedirect = () => {
  const session = useSession()
  return <Navigate to={session ? homePathFor(session.role) : "/cartelera"} replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route element={<PublicLayout />}>
          <Route path="/cartelera" element={<BillboardPage />} />
          <Route path="/cartelera/:movieId" element={<MovieDetailPage />} />
        </Route>

        {/* Rutas Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={STAFF_ROLES}><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="peliculas" replace />} />
          <Route path="peliculas" element={<Dashboard />} />
          <Route path="generos" element={<GenreDashboard />} />
          <Route path="salas" element={<ScreenDashboard />} />
          <Route path="ventas" element={<SalesPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="clientes" element={<UserDashboard key={ROLES.client} role={ROLES.client} />} />
          <Route
            path="administradores"
            element={<ProtectedRoute roles={[ROLES.superAdmin]}><UserDashboard key={ROLES.admin} role={ROLES.admin} /></ProtectedRoute>}
          />
          <Route path="cargos" element={<ProtectedRoute roles={[ROLES.superAdmin]}><FeeDashboard /></ProtectedRoute>} />
          <Route path="perfil" element={<Profile />} />
        </Route>

        {/* Rutas Usuario */}
        <Route path="/panel" element={<ProtectedRoute roles={[ROLES.client]}><PublicLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/cartelera" replace />} />
          <Route path="cartelera" element={<Navigate to="/cartelera" replace />} />
          <Route path="peliculas/:movieId" element={<LegacyMovieRedirect />} />
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
