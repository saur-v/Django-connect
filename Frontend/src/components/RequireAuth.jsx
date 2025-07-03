// src/components/RequireAuth.jsx
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const isAuth = !!localStorage.getItem('access_token');

  return isAuth ? children : <Navigate to="/login" replace />;
}
