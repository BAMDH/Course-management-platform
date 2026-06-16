// src/pages/admin/AdminDashboard.tsx

import { useEffect, useState } from "react";

import AdminLayout from "@/layout/AdminLayout";

import {
  Users,
  ChefHat,
  Wallet,
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


const quickActions = [
  {
    icon: (
      <ClipboardList className="text-gray-700" />
    ),

    title: "Informe de\nasistencias",

    href: "/admin/Attendance",
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

     

      const totalTeachers =
        roles?.filter(
          (role) =>
            role.role === "teacher"
        ).length ?? 0;

      const totalStudents =
        roles?.filter(
          (role) =>
            role.role === "student"
        ).length ?? 0;

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

          {/* Quick Actions */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
    {quickActions.map((action, index) => (
      <Link
        to={action.href}
        key={index}
      >
        <Card className="p-6 hover:shadow-md transition cursor-pointer hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                {action.icon}
              </div>

              <h3 className="text-xl font-bold text-[#202020]">
                {action.title}
              </h3>
            </div>

            <ArrowRight
              size={24}
              className="text-[#202020] shrink-0"
            />
          </div>
      </Card>
    </Link>
  ))}
</div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;