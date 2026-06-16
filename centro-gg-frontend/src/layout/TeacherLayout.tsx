import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

import { supabase } from "@/services/supabase";
import { useAuth } from "@/providers/auth/useAuth";

const navItems = [
  { name: "Dashboard", path: "/teacher", icon: LayoutDashboard },
  { name: "Mis Cursos", path: "/teacher/courses", icon: BookOpen },
  { name: "Calendario", path: "/teacher/calendar", icon: CalendarDays },
  { name: "Asistencia", path: "/teacher/attendance", icon: ClipboardList },
  { name: "Estudiantes", path: "/teacher/students", icon: GraduationCap },
];

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

type SessionNotification = {
  id: string;
  title: string;
  starts_at: string;
  courses:
    | {
        title: string;
      }
    | {
        title: string;
      }[]
    | null;
};

export function TeacherLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<SessionNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const initials = profile?.full_name
  ? profile.full_name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  : "P"

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
    }

    void loadProfile();
  }, [user?.id]);

  useEffect(() => {
    async function loadSessionNotifications() {
      if (!user?.id) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(today);
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 2);

      const { data: assignedCourses } = await supabase
        .from("course_teachers")
        .select("course_id")
        .eq("teacher_id", user.id);

      const courseIds = assignedCourses?.map((item) => item.course_id) ?? [];

      if (courseIds.length === 0) {
        setNotifications([]);
        return;
      }

      const { data } = await supabase
        .from("course_sessions")
        .select(`
          id,
          title,
          starts_at,
          courses (
            title
          )
        `)
        .in("course_id", courseIds)
        .gte("starts_at", today.toISOString())
        .lt("starts_at", tomorrowEnd.toISOString())
        .order("starts_at", { ascending: true });

      setNotifications(data ?? []);
    }

    void loadSessionNotifications();
  }, [user?.id]);

  async function handleLogout() {
    localStorage.removeItem("selected_app_role");
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function formatSessionDate(value: string) {
    return new Intl.DateTimeFormat("es-CR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-[#1b1c1b]">
      <header className="fixed left-0 right-0 top-0 z-40 h-28 bg-[#fbf9f8]/80 shadow-sm backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-4"
          >
            <img
              src="/logo-gyg.png"
              alt="Centro de Capacitación G&G"
              className="h-16 w-auto"
            />

            <div className="text-left">
              <h1 className="font-['Manrope',sans-serif] text-xl font-extrabold leading-7 text-[#1b1c1b]">
                Centro de Capacitación G&G
              </h1>

              <p className="text-xs font-bold uppercase tracking-wide text-[#dd2817]">
                Portal Profesor
              </p>
            </div>
          </button>

          <div className="relative flex items-center gap-6">
            <button
              type="button"
              onClick={() => setShowNotifications((current) => !current)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#e9e8e7] text-[#1b1c1b]"
            >
              <Bell className="h-5 w-5" />

              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#dd2817] text-xs font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-14 top-14 w-80 rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl">
                <p className="mb-3 text-sm font-extrabold text-[#1b1c1b]">
                  Recordatorios de sesiones
                </p>

                {notifications.length === 0 ? (
                  <p className="text-sm text-[#5d5e60]">
                    No tenés sesiones programadas para hoy o mañana.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((session) => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/teacher/calendar");
                        }}
                        className="w-full rounded-xl bg-[#f5f3f2] p-3 text-left hover:bg-red-50"
                      >
                        <p className="text-sm font-bold text-[#1b1c1b]">
                          {session.title}
                        </p>

                        <p className="text-xs font-medium text-[#5d5e60]">
                          {Array.isArray(session.courses)
                            ? session.courses[0]?.title
                            : session.courses?.title}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#dd2817]">
                          {formatSessionDate(session.starts_at)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate("/teacher/profile")}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#b70700] bg-[#b70700]"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f5f3f2] text-sm font-bold text-[#dd2817]">
                  {initials}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-28 z-30 flex h-[calc(100vh-7rem)] w-64 flex-col bg-[#f5f3f2] p-6">
        <div className="px-4 pb-8">
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
            to="/teacher/help"
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