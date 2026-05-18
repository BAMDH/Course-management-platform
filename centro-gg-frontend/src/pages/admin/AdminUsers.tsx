// src/pages/admin/AdminUsers.tsx

import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/layout/AdminLayout";

import Card from "@/components/admin/Cards/Card";
import StatCard from "@/components/admin/Cards/StatCard";

import Button from "@/components/admin/Button";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/headers/PageHeader";

import SearchInput from "@/components/admin/ui/SearchInput";

import TableHeader from "@/components/admin/tables/TableHeader";

import UserRow from "@/components/admin/tables/UserRow";

import { supabase } from "@/services/supabase";

type UserData = {
  id: string;
  full_name: string | null;
  email: string;
  status: string;
  role: string;
  avatar_url: string | null;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Obtener profiles
      const { data: profiles, error: profilesError } =
        await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            email,
            status,
            avatar_url
          `);

      if (profilesError) {
        console.error(profilesError);
        return;
      }

      // Obtener roles
      const { data: roles, error: rolesError } =
        await supabase
          .from("user_roles")
          .select(`
            user_id,
            role
          `);

      if (rolesError) {
        console.error(rolesError);
        return;
      }

      // Combinar datos
      const formattedUsers =
        profiles?.map((profile) => {
          const userRole = roles?.find(
            (r) => r.user_id === profile.id
          );

          return {
            id: profile.id,
            full_name:
              profile.full_name || "Sin nombre",
            email: profile.email,
            status: profile.status,
            role: userRole?.role || "student",
            avatar_url: profile.avatar_url,
          };
        }) || [];

      setUsers(formattedUsers);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  // Filtrar búsqueda
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const value = search.toLowerCase();

      return (
        user.full_name
          ?.toLowerCase()
          .includes(value) ||
        user.email
          .toLowerCase()
          .includes(value) ||
        user.role
          .toLowerCase()
          .includes(value)
      );
    });
  }, [users, search]);

  // Estadísticas
  const totalUsers = users.length;

  const totalStudents = users.filter(
    (u) => u.role === "student"
  ).length;

  const totalTeachers = users.filter(
    (u) => u.role === "teacher"
  ).length;

  const totalActive = users.filter(
    (u) => u.status === "active"
  ).length;

  const toggleUserStatus = async (
  userId: string,
  currentStatus: string
) => {
  const newStatus =
    currentStatus === "active"
      ? "blocked"
      : "active";

  const { error } = await supabase
    .from("profiles")
    .update({
      status: newStatus,
    })
    .eq("id", userId);

  if (error) {
    console.error(error);
    return;
  }
  

  await fetchUsers();

};

  return (
    <AdminLayout>
      <main className="min-h-screen bg-[#f5f5f5] p-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              {
                label: "Administración",
                href: "/admin",
              },

              {
                label: "Gestión de Usuarios",
                href: "/admin/users",
              },
            ]}
          />

          <PageHeader
            title="Usuarios Registrados"
            description="Administre el acceso y roles de la comunidad del Centro de Capacitación G&G."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="TOTAL USUARIOS"
            value={String(totalUsers)}
            icon="👤"
          />

          <StatCard
            title="ESTUDIANTES"
            value={String(totalStudents)}
            icon="🎓"
          />

          <StatCard
            title="PROFESORES"
            value={String(totalTeachers)}
            icon="🧑‍🏫"
          />

          <StatCard
            title="ACTIVOS"
            value={String(totalActive)}
            icon="⚡"
          />
        </div>

        {/* Table */}
        <Card className="overflow-hidden mb-8">
          {/* Search */}
          <div className="p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between border-b border-gray-100">
            <SearchInput
              placeholder="Buscar usuarios, correos o roles..."
              value={search}
              onChange={(e: any) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                  <TableHeader>
                    NOMBRE
                  </TableHeader>

                  <TableHeader>
                    CORREO ELECTRÓNICO
                  </TableHeader>

                  <TableHeader>
                    ROL ACTUAL
                  </TableHeader>

                  <TableHeader>
                    ESTADO
                  </TableHeader>

                  <TableHeader>
                    ACCIONES
                  </TableHeader>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-gray-500"
                    >
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-gray-500"
                    >
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      onBan={() =>
                          toggleUserStatus(
                            user.id,
                            user.status
                          )
                        }
                        user={{
                        name: user.full_name || "Sin nombre",
                        email: user.email,

                        role:
                          user.role === "admin"
                            ? "Administrador"
                            : user.role ===
                              "teacher"
                            ? "Profesor"
                            : "Estudiante",

                        status:
                          
                            user.status === "active"
                              ? "Activo"
                              : "Bloqueado",

                        image:
                          user.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.full_name ||
                              "Usuario"
                          )}`,
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5 text-sm text-gray-500">
            <p>
              Mostrando {filteredUsers.length} de{" "}
              {users.length} usuarios
            </p>
          </div>
        </Card>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security */}
          <Card className="bg-[#ebe8e8] p-8 relative overflow-hidden border-none">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Protocolo de Seguridad
              </h3>

              <p className="text-gray-600 leading-relaxed max-w-md">
                Recuerde que el bloqueo de usuarios
                suspende el acceso inmediato a la
                plataforma y materiales de curso.
              </p>
            </div>

            <div className="absolute right-0 bottom-0 text-8xl opacity-10">
              🛡️
            </div>
          </Card>

          {/* Roles */}
          <Card className="bg-red-600 text-white p-8 relative overflow-hidden border-none">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Asignación de Roles
              </h3>

              <p className="leading-relaxed max-w-md text-red-100">
                Los roles de profesor habilitan
                herramientas de gestión, evaluación y
                administración académica.
              </p>
            </div>

            <div className="absolute right-0 bottom-0 text-8xl opacity-10">
              ⭐
            </div>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminUsers;