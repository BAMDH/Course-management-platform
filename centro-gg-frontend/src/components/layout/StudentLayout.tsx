import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/providers/auth/useAuth';
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  GraduationCap, 
  Wallet, 
  UserCircle, 
  LogOut, 
  HelpCircle,
  Bell
} from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '@/services/supabase';

const navItems = [
  { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
  { name: 'Mis Cursos', path: '/student/courses', icon: BookOpen },
  { name: 'Calendario', path: '/student/calendar', icon: CalendarDays },
  { name: 'Calificaciones', path: '/student/certificates', icon: GraduationCap },
  { name: 'Historial de Pagos', path: '/student/payments', icon: Wallet },
  { name: 'Mi Perfil', path: '/student/profile', icon: UserCircle },
];

export function StudentLayout() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen w-full bg-[#fcfbfb] text-[#1b1c1b] font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className="w-[270px] flex flex-col bg-[#f5f3f2] border-r border-[#e9e8e7] flex-shrink-0 z-20 hidden md:flex">
        <div className="p-8 pb-4">
          <h2 className="font-['Manrope',sans-serif] font-bold text-[18px] text-[#1b1c1b]">
            Panel de Control
          </h2>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/student'}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-white text-[#dc2626] font-semibold drop-shadow-sm"
                    : "text-[#5d5e60] font-medium hover:bg-white/50 hover:text-[#1b1c1b]"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[14px]">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-8 pt-4">
          <div className="border-t border-[#e9e8e7] pt-4 flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-[#5d5e60] font-medium hover:text-[#dc2626] transition-colors rounded-xl w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[14px]">Cerrar Sesión</span>
            </button>
            <Link
              to="/help"
              className="flex items-center gap-3 px-4 py-2 text-[#5d5e60] font-medium hover:text-[#1b1c1b] transition-colors rounded-xl w-full"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-[14px]">Ayuda</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[90px] bg-[rgba(251,249,248,0.8)] backdrop-blur-md flex items-center justify-between px-8 z-10 flex-shrink-0 sticky top-0">
          <div className="flex items-center gap-4">
            {/* You can place the actual logo image here */}
            <div className="w-12 h-12 bg-[#dc2626] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-red-500/20">
              G&G
            </div>
            <h1 className="font-['Manrope',sans-serif] font-extrabold text-[20px] text-[#dc2626] tracking-tight uppercase hidden sm:block">
              Centro de Capacitación G&G
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-[#e9e8e7] hover:bg-[#dfdfe1] flex items-center justify-center text-[#5d5e60] transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border-2 border-[#dc2626] overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all">
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#fcfbfb]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
