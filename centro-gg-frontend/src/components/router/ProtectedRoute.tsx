import { Navigate } from 'react-router-dom';
import type { AppRole } from '@/types/roles';
import { useAuth } from '@/providers/auth/useAuth';


interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
