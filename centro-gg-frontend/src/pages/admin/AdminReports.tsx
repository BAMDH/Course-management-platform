import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

import {
  TrendingUp,
  Users,
  BadgeDollarSign,
  Star,
} from "lucide-react";



const AdminReports = () => {
  const [selectedMonth, setSelectedMonth] =
  useState<number | "all">("all");

const [selectedYear, setSelectedYear] =
  useState(new Date().getFullYear());
  const [totalSales, setTotalSales] =
    useState(0);

  const [averageSale, setAverageSale] =
    useState(0);

  const [newStudents, setNewStudents] =
    useState(0);

  const [topCategory, setTopCategory] =
    useState("N/A");

  const [categoriesChart, setCategoriesChart] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

useEffect(() => {
  fetchReportData();
}, [selectedMonth, selectedYear]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // PAGOS
      const { data: payments } =
        await supabase
          .from("payments")
          .select(`
            total,
            paid_at,
            status
          `)
          .eq("status", "paid");

      const filteredPayments =
          payments?.filter((payment: any) => {
            const date = new Date(
              payment.paid_at
            );

            const yearMatch =
              date.getFullYear() ===
              selectedYear;

            const monthMatch =
              selectedMonth === "all" ||
              date.getMonth() ===
                selectedMonth;

            return yearMatch && monthMatch;
          }) ?? [];
      const sales =
        filteredPayments.reduce(
          (sum, payment: any) =>
            sum + Number(payment.total),
          0
        );

      setTotalSales(sales);

      setAverageSale(
        filteredPayments && filteredPayments.length> 0
          ? sales / filteredPayments.length
          : 0
      );

      // ESTUDIANTES
      const { data: students } =
        await supabase
          .from("profiles")
          .select(`
            id,
            created_at,
            user_roles (
              role
            )
          `);

      const studentCount =
      students?.filter((student: any) => {
        const created = new Date(student.created_at);

        const isStudent =
          student.user_roles?.some(
            (role: any) =>
              role.role === "student"
          );

        const yearMatch =
          created.getFullYear() === selectedYear;

        const monthMatch =
          selectedMonth === "all" ||
          created.getMonth() === selectedMonth;

        return (
          isStudent &&
          yearMatch &&
          monthMatch
        );
      }).length ?? 0;

      setNewStudents(studentCount);

      // CATEGORÍAS
      const { data: items } =
        await supabase
          .from("payment_items")
          .select(`
            quantity,
            courses (
              category
            ),
            payments (
              status,
            paid_at
            )
          `);

      const categoryTotals: Record<
        string,
        number
      > = {};

      items?.forEach((item: any) => {
        if (
          item.payments?.status !==
          "paid"
        )
          return;

        const category =
          item.courses?.category ??
          "Sin categoría";
          const paymentDate = new Date(
            item.payments?.paid_at
          );

          const yearMatch =
            paymentDate.getFullYear() ===
            selectedYear;

          const monthMatch =
            selectedMonth === "all" ||
            paymentDate.getMonth() ===
              selectedMonth;

          if (!yearMatch || !monthMatch)
            return;
        categoryTotals[category] =
          (categoryTotals[
            category
          ] ?? 0) + item.quantity;
      });

      const top =
        Object.entries(
          categoryTotals
        ).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] ?? "N/A";

      setTopCategory(top);

      const totalSold =
        Object.values(
          categoryTotals
        ).reduce(
          (a, b) => a + b,
          0
        );

      const chart =
        Object.entries(
          categoryTotals
        ).map(
          ([name, amount]) => ({
            name,
            percentage:
              totalSold > 0
                ? (
                    (amount /
                      totalSold) *
                    100
                  ).toFixed(0)
                : "0",
          })
        );

      setCategoriesChart(chart);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="p-8">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Informe de Ventas
          </h1>

          <p className="text-gray-500">
            Reportes generales del sistema.
          </p>
        </div>
<div className="bg-white rounded-[32px] border border-gray-200 p-8 mb-8">
  <div className="grid md:grid-cols-2 gap-6">

    <div>
      <label className="text-xs tracking-widest text-gray-400 font-semibold block mb-3">
        MES
      </label>

      <select
        value={selectedMonth}
        onChange={(e) =>
          setSelectedMonth(
            e.target.value === "all"
              ? "all"
              : Number(e.target.value)
          )
        }
        className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200"
      >
        <option value="all">Todos</option>
        <option value={0}>Enero</option>
        <option value={1}>Febrero</option>
        <option value={2}>Marzo</option>
        <option value={3}>Abril</option>
        <option value={4}>Mayo</option>
        <option value={5}>Junio</option>
        <option value={6}>Julio</option>
        <option value={7}>Agosto</option>
        <option value={8}>Septiembre</option>
        <option value={9}>Octubre</option>
        <option value={10}>Noviembre</option>
        <option value={11}>Diciembre</option>
      </select>
    </div>

    <div>
      <label className="text-xs tracking-widest text-gray-400 font-semibold block mb-3">
        AÑO
      </label>

      <select
        value={selectedYear}
        onChange={(e) =>
          setSelectedYear(Number(e.target.value))
        }
        className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200"
      >
        {Array.from({ length: 2406 - 2026 + 1 }, (_, i) => 2026 + i).map((year) => (
        <option
          key={year}
          value={year}
        >
          {year}
        </option>
      ))}

      </select>
    </div>

  </div>
</div>
        <div className="grid xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-[32px] p-6 border border-gray-200">
            <div className="bg-red-100 p-3 rounded-2xl w-fit mb-6">
              <TrendingUp className="text-red-600" />
            </div>

            <p className="text-sm text-gray-400 mb-2">
              VENTAS TOTALES
            </p>

            <h2 className="text-4xl font-bold">
              ₡
              {totalSales.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-gray-200">
            <div className="bg-blue-100 p-3 rounded-2xl w-fit mb-6">
              <Users className="text-blue-600" />
            </div>

            <p className="text-sm text-gray-400 mb-2">
              NUEVOS ALUMNOS
            </p>

            <h2 className="text-4xl font-bold">
              {newStudents}
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-gray-200">
            <div className="bg-gray-100 p-3 rounded-2xl w-fit mb-6">
              <BadgeDollarSign className="text-gray-600" />
            </div>

            <p className="text-sm text-gray-400 mb-2">
              INGRESO PROMEDIO
            </p>

            <h2 className="text-4xl font-bold">
              ₡
              {averageSale.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 0,
                }
              )}
            </h2>
          </div>

          <div className="bg-red-600 rounded-[32px] p-6 text-white">
            <div className="bg-white/20 p-3 rounded-2xl w-fit mb-8">
              <Star />
            </div>

            <p className="text-sm opacity-80 mb-2">
              TOP CATEGORÍA
            </p>

            <h2 className="text-4xl font-bold">
              {topCategory}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-200 p-8">
          <h2 className="text-3xl font-bold mb-8">
            Ventas por Categoría
          </h2>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-8">
              {categoriesChart.map(
                (category) => (
                  <div
                    key={category.name}
                  >
                    <div className="flex justify-between mb-3">
                      <span>
                        {
                          category.name
                        }
                      </span>

                      <span className="font-bold">
                        {
                          category.percentage
                        }
                        %
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 h-3 rounded-full">
                      <div
                        className="bg-red-600 h-3 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminReports;
