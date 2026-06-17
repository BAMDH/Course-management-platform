import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "@/components/nav/AdminSidebar";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/providers/auth/useAuth";
import { Bell, ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import clsx from "clsx";

const AdminLayout = () => {
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    async function fetchLayoutData() {
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileData) setProfile(profileData);

      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (announcementsData) setAnnouncements(announcementsData);
    }
    fetchLayoutData();
  }, [user]);

  const handleLogout = async () => {
    localStorage.removeItem("selected_app_role");
    await supabase.auth.signOut();
    window.location.href = window.location.origin;
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'A';
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

      {/* Sidebar Component */}
      <AdminSideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
                    <p className="text-sm font-bold text-[#1b1c1b] truncate">{profile?.full_name || 'Administrador'}</p>
                    <p className="text-xs text-[#5d5e60] truncate">{user?.email}</p>
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
    </div>
  );
};

export default AdminLayout;