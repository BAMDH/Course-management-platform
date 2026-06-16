import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { getUserRoles } from '@/services/authService';
import { useAuth } from '@/providers/auth/useAuth';
import type { AppRole } from '@/types/roles';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { selectRole } = useAuth();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session && data.session.user) {
        const userId = data.session.user.id;
        const roles = await getUserRoles(userId);

        if (roles.length === 0) {
          navigate('/unauthorized', { replace: true });
          return;
        }

        selectRole(roles[0]);
        
        const getRouteByRole = (role: AppRole) => {
          if (role === "admin") return "/admin";
          if (role === "teacher") return "/teacher";
          return "/student";
        };

        navigate(getRouteByRole(roles[0]), { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, [navigate, selectRole]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Verificando sesión...</p>
    </div>
  );
};

export default AuthCallback;
