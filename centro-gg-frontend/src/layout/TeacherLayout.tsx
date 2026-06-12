import { Outlet, NavLink, Link } from "react-router-dom";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

import { supabase } from "@/services/supabase";

const navItems = [
  { name: "Dashboard", path: "/teacher", icon: LayoutDashboard },
  { name: "Mis Cursos", path: "/teacher/courses", icon: BookOpen },
  { name: "Calendario", path: "/teacher/calendar", icon: CalendarDays },
  { name: "Asistencia", path: "/teacher/attendance", icon: ClipboardList },
];

export function TeacherLayout() {
  async function handleLogout() {
    localStorage.removeItem("selected_app_role");
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-[#1b1c1b]">
      <header className="fixed left-0 right-0 top-0 z-40 h-28 bg-[#fbf9f8]/80 shadow-sm backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center bg-white text-sm font-black text-[#dd2817]">
              G&G
            </div>

            <h1 className="font-['Manrope',sans-serif] text-xl font-extrabold uppercase leading-7 text-[#dd2817]">
              Centro de Capacitación G&G
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9e8e7] text-[#1b1c1b]">
              <Bell className="h-5 w-5" />
            </button>

            <button className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#b70700] bg-[#b70700]">
              <div className="flex h-full w-full items-center justify-center bg-[#f5f3f2] text-sm font-bold text-[#dd2817]">
                P
              </div>
            </button>
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-28 z-30 flex h-[calc(100vh-7rem)] w-64 flex-col bg-[#f5f3f2] p-6">
        <div className="pb-8 px-4">
          <h2 className="font-['Manrope',sans-serif] text-lg font-bold leading-7 text-[#1b1c1b]">
            Panel de Control
          </h2>

          <p className="text-xs font-medium leading-4 text-[#5d5e60]">
            Profesor
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/teacher"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold leading-5 transition-colors",
                  isActive
                    ? "bg-white text-[#dd2817] shadow-sm"
                    : "text-[#5d5e60] hover:bg-white/60 hover:text-[#1b1c1b]"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#e6bdb6]/20 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-left text-sm font-semibold text-[#5d5e60] hover:text-[#dd2817]"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>

          <Link
            to="/help"
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-[#5d5e60] hover:text-[#1b1c1b]"
          >
            <HelpCircle className="h-4 w-4" />
            Ayuda
          </Link>
        </div>
      </aside>

      <div className="ml-64 pt-28">
        <Outlet />
      </div>
    </div>
  );
}