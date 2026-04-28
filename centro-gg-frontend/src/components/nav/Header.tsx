import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/auth/useAuth';

const Header = () => {
  const { user, role } = useAuth();

  return (
    <>
      <header className="w-full border-b px-6 py-3 flex items-center justify-between bg-white">
        <Link to="/" className="font-bold text-xl tracking-tight">
          CDCGG
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/courses" className="hover:underline">
            Cursos
          </Link>
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Iniciar sesión
              </Link>
              <Link to="/register" className="hover:underline font-semibold">
                Registro
              </Link>
            </>
          )}
          {user && role === 'student' && (
            <Link to="/student" className="hover:underline">
              Mi panel
            </Link>
          )}
          {user && role === 'teacher' && (
            <Link to="/teacher" className="hover:underline">
              Mi panel
            </Link>
          )}
          {user && role === 'admin' && (
            <Link to="/admin" className="hover:underline">
              Administración
            </Link>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
