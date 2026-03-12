import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import { setApiToken } from './services/api'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AuditLog from './pages/AuditLog'
import EditData from './pages/EditData'
import Export from './pages/Export'
import DeleteAccount from './pages/DeleteAccount'
import AdminDashboard from './pages/AdminDashboard'

function TokenSync() {
  const { token, logout } = useAuth()
  useEffect(() => { setApiToken(token) }, [token])
  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('gdpr:logout', handler)
    return () => window.removeEventListener('gdpr:logout', handler)
  }, [logout])
  return null
}

function AppRoutes() {
  return (
    <>
      <TokenSync />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-activity" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><EditData /></ProtectedRoute>} />
        <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
        <Route path="/delete" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
