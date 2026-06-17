
import {
  Wallet,
} from "lucide-react";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/Headers/PageHeader";

import Card from "@/components/admin/Cards/Card";

import StatCard from "@/components/admin/Cards/StatCard";

import TableHeader from "@/components/admin/tables/TableHeader";


import SearchInput from "@/components/admin/ui/SearchInput";

import PaymentRow from "@/components/admin/tables/PaymentRow";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/services/supabase";

type Payment = {
  id: string;
  studentId: string; // 👈 AGREGAR ESTO
  initials: string;
  student: string;
  invoiceId: string;
  date: string;
  status: string;
};

const AdminPayments = () => {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchPayments();
    
  }, []);
  const statusMap: Record<string, string> = {
  paid: "PAGADO",
  pending: "PENDIENTE",
  cancelled: "RECHAZADO",
};

const [stats, setStats] = useState({
  paid: 0,
  pending: 0,
  cancelled: 0,
});
  const fetchPayments = async () => {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("payments")
        .select(`
          id,
          status,
          issued_at,
          student_id,
          profiles (
            full_name
          )
        `)
        .order("issued_at", {
          ascending: false,
        });

    if (error) {
      console.error(error);

      setLoading(false);

      return;
    }

    const formattedPayments =
      data.map((payment) => ({
        id: payment.id,
          studentId: payment.student_id,
        student:
            (payment.profiles as any)?.full_name ??
            "Sin nombre",

        initials:
          (payment.profiles as any)?.full_name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "NA",

        invoiceId:
          payment.id.slice(0, 8),

        date: new Date(
          payment.issued_at
        ).toLocaleDateString(),

       status: statusMap[payment.status] ?? payment.status,
      })) || [];

    setPayments(formattedPayments);

const paid = data.filter(
  (p) => p.status === "paid"
).length;

const pending = data.filter(
  (p) => p.status === "pending"
).length;

const cancelled = data.filter(
  (p) => p.status === "cancelled"
).length;

setStats({ paid,  pending,  cancelled,});

setLoading(false);
}

const filteredPayments =
  useMemo(() => {
    const value =
      search.toLowerCase();

    return payments.filter(
      (payment) =>
        payment.student
          .toLowerCase()
          .includes(value) ||

        payment.invoiceId
          .toLowerCase()
          .includes(value) ||

        payment.status
          .toLowerCase()
          .includes(value) ||

        payment.date
          .toLowerCase()
          .includes(value)
    );
  }, [payments, search]);   


  return (
    <>
      <main className="p-8">
        {/* Header */}
        <div className="mb-10">
          <Breadcrumbs
            items={[
              {
                label: "Administración",
                href: "/admin",
              },

              {
                label: "Control de Pagos",
                href: "/admin/payments",
              },
            ]}
          />

          <PageHeader
            title="Control de Pagos"
            description="Administre facturación, pagos pendientes y transacciones de estudiantes."
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="PAGADOS"
            value={stats.paid}
            icon={<Wallet size={28} />}
          />

          <StatCard
            title="PENDIENTES"
            value={stats.pending}
            icon={<Wallet size={28} />}
          />

          <StatCard
            title="RECHAZADOS"
            value={stats.cancelled}
            icon={<Wallet size={28} />}
          />
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          {/* Top Actions */}
          <div className="p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between border-b border-gray-100">
            <SearchInput
                  placeholder="Buscar estudiante o factura..."
                  value={search}
                  onChange={(e: any) =>
                    setSearch(e.target.value)
                  }
                />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                  <TableHeader>
                    ESTUDIANTE
                  </TableHeader>

                  <TableHeader>
                    FACTURA
                  </TableHeader>

                  <TableHeader>
                    FECHA
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
                      Cargando pagos...
                    </td>
                  </tr>
                ) : filteredPayments.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-gray-500"
                    >
                      No se encontraron pagos
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map(
                    (payment) => (
                      <PaymentRow
                        key={payment.id}
                        payment={payment}
                      />
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-5 text-sm text-gray-500">
            <p>
              Mostrando{" "}
              {filteredPayments.length} pagos
            </p>
          </div>
        </Card>
      </main>
    </>
  );
};

export default AdminPayments;
