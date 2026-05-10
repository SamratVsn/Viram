// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const raw = localStorage.getItem('viram_user')

  if (!raw) return <Navigate to="/start" replace />

  try {
    const user = JSON.parse(raw)
    if (!user?.email) return <Navigate to="/start" replace />
  } catch {
    localStorage.removeItem('viram_user')
    return <Navigate to="/start" replace />
  }

  return children
}