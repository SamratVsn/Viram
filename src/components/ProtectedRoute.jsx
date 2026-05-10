// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const raw = localStorage.getItem('viram_user')

  // No user stored → back to start
  if (!raw) return <Navigate to="/start" replace />

  try {
    const user = JSON.parse(raw)
    // Make sure it's a real user object, not corrupted data
    if (!user?.email) return <Navigate to="/start" replace />
  } catch {
    // Corrupted JSON → clear it and redirect
    localStorage.removeItem('viram_user')
    return <Navigate to="/start" replace />
  }

  return children
}