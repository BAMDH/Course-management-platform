import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, ReceiptText, FileText, ClipboardList, LogOut } from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/services/supabase";

interface Props {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
}

const SideNav = ({ isSidebarOpen, setIsSidebarOpen }: Props) => {
  const location = useLocation();

  const handleLogout = async () => {
    localStorage.removeItem("selected_app_role");
    await supabase.auth.signOut();
    window.location.href = window.location.origin;
  };

  const links = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Gestión de usuarios", path: "/admin/users", icon: <Users size={20} /> },
    { label: "Gestión de cursos", path: "/admin/courses", icon: <BookOpen size={20} /> },
    { label: "Pagos", path: "/admin/payments", icon: <ReceiptText size={20} /> },
    { label: "Asistencia", path: "/admin/attendance", icon: <ClipboardList size={20} /> },
    { label: "Reportes", path: "/admin/reports", icon: <FileText size={20} /> },
  ];

  return (
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
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                active
                  ? "bg-white border border-[#e9e8e7] shadow-sm text-[#dc2626] font-bold"
                  : "text-[#5d5e60] hover:text-[#1b1c1b] hover:bg-white/50 font-medium",
                !isSidebarOpen && "md:justify-center md:px-0"
              )}
              title={!isSidebarOpen ? link.label : undefined}
            >
              <div className="flex items-center justify-center">{link.icon}</div>
              {isSidebarOpen && <span className="text-[14px] whitespace-nowrap">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-[#e9e8e7] mt-auto">
        <div className={clsx("flex items-center", isSidebarOpen ? "justify-start gap-2" : "justify-center")}>
          <button
            onClick={handleLogout}
            title={!isSidebarOpen ? "Cerrar sesión" : undefined}
            className="w-12 h-12 flex items-center justify-center text-[#dc2626] hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;