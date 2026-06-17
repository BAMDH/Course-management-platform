import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
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
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ChevronDown,
  Compass
} from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '@/services/supabase';
import { CompleteProfileModal } from './CompleteProfileModal';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
  { name: 'Mis Cursos', path: '/student/courses', icon: BookOpen },
  { name: 'Catálogo de Cursos', path: '/courses', icon: Compass },
  { name: 'Calendario', path: '/student/calendar', icon: CalendarDays },
  { name: 'Calificaciones', path: '/student/certificates', icon: GraduationCap },
  { name: 'Historial de Pagos', path: '/student/payments', icon: Wallet },
  { name: 'Mi Perfil', path: '/student/profile', icon: UserCircle },
];

export function StudentLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdowns on outside click
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    async function fetchLayoutData() {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileData) setProfile(profileData);

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (announcementsData) setAnnouncements(announcementsData);
    }
    fetchLayoutData();
  }, [user]);

  const isProfileComplete = profile && profile.full_name && profile.phone && profile.identification && profile.province && profile.district && profile.exact_address;

  const handleLogout = async () => {
    localStorage.removeItem("selected_app_role");
    await supabase.auth.signOut();
    window.location.href = window.location.origin;
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="flex h-screen w-full bg-[#fcfbfb] text-[#1b1c1b] font-['Inter',sans-serif] overflow-hidden">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "flex flex-col bg-[#f5f3f2] border-r border-[#e9e8e7] flex-shrink-0 z-50 transition-all duration-300",
          "fixed inset-y-0 left-0 md:relative",
          isSidebarOpen ? "translate-x-0 w-[270px]" : "-translate-x-full w-[270px] md:w-[80px] md:translate-x-0"
        )}
      >
        <div className={clsx("p-8 pb-4 flex items-center", isSidebarOpen ? "justify-start" : "justify-center")}>
          {isSidebarOpen && (
            <h2 className="font-['Manrope',sans-serif] font-bold text-[18px] text-[#1b1c1b] whitespace-nowrap">
              Panel de Control
            </h2>
          )}
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/student'}
              className={({ isActive }) =>
                clsx(
                  "flex items-center rounded-xl transition-all duration-200 group",
                  isSidebarOpen ? "gap-3 px-4 py-3" : "justify-center p-3 mx-auto w-12 h-12",
                  isActive
                    ? "bg-white text-[#dc2626] font-semibold drop-shadow-sm"
                    : "text-[#5d5e60] font-medium hover:bg-white/50 hover:text-[#1b1c1b]"
                )
              }
              title={!isSidebarOpen ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-[14px] whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-8 pt-4">
          <div className="border-t border-[#e9e8e7] pt-4 flex flex-col gap-2">
            {/* Solo se muestran iconos si está cerrado */}
            {isSidebarOpen ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-[#5d5e60] font-medium hover:text-[#dc2626] transition-colors rounded-xl w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-[14px]">Cerrar Sesión</span>
                </button>
                <Link
                  to="/student/help"
                  className="flex items-center gap-3 px-4 py-2 text-[#5d5e60] font-medium hover:text-[#1b1c1b] transition-colors rounded-xl w-full"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-[14px]">Ayuda</span>
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="w-12 h-12 flex items-center justify-center text-[#5d5e60] hover:text-[#dc2626] hover:bg-white/50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <Link
                  to="/student/help"
                  title="Ayuda"
                  className="w-12 h-12 flex items-center justify-center text-[#5d5e60] hover:text-[#1b1c1b] hover:bg-white/50 rounded-xl transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[90px] bg-[rgba(251,249,248,0.8)] backdrop-blur-md flex items-center justify-between px-6 md:px-8 z-10 flex-shrink-0 sticky top-0 border-b border-[#e9e8e7]/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-[#5d5e60] hover:bg-[#e9e8e7] hover:text-[#1b1c1b] rounded-xl transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>

            <img src="/logo-gyg.png" alt="Centro G&G" className="w-12 h-12 object-contain drop-shadow-md" />

            <h1 className="font-['Manrope',sans-serif] font-extrabold text-[20px] bg-gradient-to-r from-[#dc2626] to-[#ea580c] bg-clip-text text-transparent tracking-tight uppercase hidden sm:block">
              Centro de Capacitación G&G
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 rounded-full bg-[#e9e8e7] hover:bg-[#dfdfe1] flex items-center justify-center text-[#5d5e60] transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-[#dc2626] border-2 border-[#fcfbfb] rounded-full"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-[#e9e8e7] py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#e9e8e7] flex justify-between items-center">
                    <h3 className="font-bold text-[#1b1c1b]">Notificaciones</h3>
                    <span className="text-xs bg-[#f5f3f2] text-[#5d5e60] px-2 py-1 rounded-full">{announcements.length} nuevas</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {announcements.length === 0 ? (
                      <div className="p-4 text-center text-[#5d5e60] text-sm">
                        No tienes notificaciones nuevas
                      </div>
                    ) : (
                      announcements.map((announcement) => (
                        <div key={announcement.id} className="p-4 border-b border-[#f5f3f2] hover:bg-[#fcfbfb] cursor-pointer transition-colors">
                          <p className="text-sm font-medium text-[#1b1c1b] mb-1">{announcement.title}</p>
                          <p className="text-xs text-[#5d5e60] line-clamp-2">{announcement.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full border-2 border-[#dc2626] overflow-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <ChevronDown className={clsx("w-4 h-4 text-[#5d5e60] transition-transform duration-200", isProfileMenuOpen ? "rotate-180" : "")} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#e9e8e7] py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#f5f3f2]">
                    <p className="text-sm font-bold text-[#1b1c1b] truncate">{profile?.full_name || 'Estudiante'}</p>
                    <p className="text-xs text-[#5d5e60] truncate">{user?.email}</p>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <button
                      onClick={() => { navigate('/student/profile'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#5d5e60] hover:text-[#1b1c1b] hover:bg-[#f5f3f2] rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Configuración
                    </button>
                    <button
                      onClick={() => { navigate('/student/payments'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#5d5e60] hover:text-[#1b1c1b] hover:bg-[#f5f3f2] rounded-xl transition-colors"
                    >
                      <Wallet className="w-4 h-4" />
                      Pagos
                    </button>
                  </div>

                  <div className="px-2 pt-2 border-t border-[#f5f3f2]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#dc2626] hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#fcfbfb]">
          <Outlet />
        </main>
      </div>

      {profile && !isProfileComplete && (
        <CompleteProfileModal 
          user={user} 
          profile={profile} 
          onSave={() => {
            // Refetch or navigate to self to update state
            window.location.reload();
          }} 
        />
      )}
    </div>
  );
}
