// src/pages/admin/AdminDashboard.tsx

import { useEffect, useState } from "react";

import AdminLayout from "@/layout/AdminLayout";

import {
  Users,
  ChefHat,
  Plus,
  Wallet,
  BookOpen,
  ClipboardList,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/Headers/PageHeader";

import Card from "@/components/admin/Cards/Card";

import StatCard from "@/components/admin/Cards/StatCard";

import { supabase } from "@/services/supabase";
import { Link } from "react-router-dom";

const activities = [
  {
    icon: <Plus size={22} className="text-blue-600" />,
    iconBg: "bg-blue-50",

    title: "Nueva Inscripción: Lucía Méndez",

    subtitle:
      "Curso: Pastelería Francesa Avanzada",

    time: "Hace 15 min",
  },

  {
    icon: (
      <Wallet
        size={22}
        className="text-green-600"
      />
    ),
    iconBg: "bg-green-50",

    title: "Pago Recibido: $450.00",

    subtitle:
      "ID Transacción: #GG-99281",

    time: "Hace 2 horas",
  },

  {
    icon: (
      <BookOpen
        size={22}
        className="text-red-500"
      />
    ),
    iconBg: "bg-red-50",

    title: "Curso terminado",

    subtitle:
      "Curso: Diplomado en Ferretería",

    time: "Hace 5 horas",
  },

  {
    icon: <Plus size={22} className="text-blue-600" />,
    iconBg: "bg-blue-50",

    title: "Nueva Inscripción: Elena Torres",

    subtitle:
      "Curso: Gestión de Negocios",

    time: "Ayer",
  },
];
const quickActions = [
  {
    icon: (
      <ClipboardList className="text-gray-700" />
    ),

    title: "Informe de\nasistencias",

    href: "/admin/attendance",
  },

  {
    icon: (
      <Wallet className="text-gray-700" />
    ),

    title: "Control de\nPagos",

    href: "/admin/payments",
  },

  {
    icon: (
      <TrendingUp className="text-gray-700" />
    ),

    title: "Informe de\nventas",

    href: "/admin/reports",
  },
];

const AdminDashboard = () => {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // TODOS LOS USUARIOS
      const { data: profiles } =
        await supabase
          .from("profiles")
          .select("id");

      // ROLES
      const { data: roles } =
        await supabase
          .from("user_roles")
          .select(`
            user_id,
            role
          `);

      // CURSOS ACTIVOS
      const { data: courses } =
        await supabase
          .from("courses")
          .select("id")
          .eq("status", "Activo");

      const totalUsers =
        profiles?.length ?? 0;

      const totalTeachers =
        roles?.filter(
          (role) =>
            role.role === "teacher"
        ).length ?? 0;

      const totalStudents =
        totalUsers - totalTeachers;

      const totalCourses =
        courses?.length ?? 0;

      setStats({
        totalStudents,
        totalTeachers,
        totalCourses,
      });

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="bg-[#f5f5f5] min-h-screen p-8">
        {/* Header */}
        <div className="mb-12">
          <Breadcrumbs
            items={[
              {
                label: "Administración",
                href: "/admin",
              },
            ]}
          />

          <PageHeader
            title="Resumen Administrativo"
            description="Bienvenido de nuevo, Administrador. Aquí está el pulso de la academia hoy."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="TOTAL ESTUDIANTES"
            value={
              loading
                ? "..."
                : String(
                    stats.totalStudents
                  )
            }
            icon={<Users size={28} />}
            trend="+12% este mes"
          />

          <StatCard
            title="PROFESORES ACTIVOS"
            value={
              loading
                ? "..."
                : String(
                    stats.totalTeachers
                  )
            }
            icon={
              <ChefHat size={28} />
            }
          />

          <Card className="bg-red-600 text-white p-6 relative overflow-hidden border-none">
            <div className="relative z-10">
              <p className="text-sm font-semibold text-red-600 mb-3">
                CURSOS ACTIVOS
              </p>

              <h3 className="text-5xl font-bold">
                {loading
                  ? "..."
                  : stats.totalCourses}
              </h3>
            </div>

            <ChefHat
              size={90}
              className="absolute right-4 bottom-0 text-red-400/40"
            />
          </Card>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          {/* Activities */}
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#202020]">
                Actividad Reciente
              </h2>

              <button className="text-red-600 font-semibold hover:opacity-80 transition">
                Ver todo el historial
              </button>
            </div>

            <Card className="overflow-hidden p-0">
              {activities.map(
                (activity, index) => (
                  <div
                    key={index}
                    className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 px-6 py-6 ${
                      index !==
                      activities.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${activity.iconBg}`}
                      >
                        {activity.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-[#202020] truncate">
                          {activity.title}
                        </h3>

                        <p className="text-gray-500 mt-1 truncate">
                          {
                            activity.subtitle
                          }
                        </p>
                      </div>
                    </div>

                    <div className="text-left lg:text-right shrink-0">
                      <p className="text-sm text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="w-full max-w-[340px] xl:ml-auto">
            <h2 className="text-3xl font-bold text-[#202020] mb-6">
              Acciones Rápidas
            </h2>

            <div className="space-y-5">
              {quickActions.map(
                (action, index) => (
                  <Link
                      to={action.href}
                      key={index}
                    >
                      <Card className="p-6 hover:shadow-md transition cursor-pointer hover:-translate-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                          {
                            action.icon
                          }
                        </div>

                        <h3 className="text-lg font-bold whitespace-pre-line text-[#202020] leading-tight">
                          {
                            action.title
                          }
                        </h3>
                      </div>

                      <ArrowRight
                        size={24}
                        className="text-[#202020] shrink-0"
                      />
                    </div>
                    </Card>
                     </Link>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;