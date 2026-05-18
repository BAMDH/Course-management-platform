// app/admin/reports/page.tsx

import AdminLayout from "@/layout/AdminLayout";
import {
  TrendingUp,
  Users,
  BadgeDollarSign,
  Star,
  Download,
} from "lucide-react";

const courses = [
  {
    name: "Pastelería Francesa",
    percentage: "45%",
    width: "w-[45%]",
    color: "bg-red-600",
  },
  {
    name: "Pastelería Tradicional",
    percentage: "28%",
    width: "w-[28%]",
    color: "bg-gray-500",
  },
  {
    name: "Administración",
    percentage: "17%",
    width: "w-[17%]",
    color: "bg-blue-600",
  },
  {
    name: "Chocolatería",
    percentage: "10%",
    width: "w-[10%]",
    color: "bg-gray-400",
  },
];

const monthlyBars = [
  { month: "MAY", height: "h-20", active: false },
  { month: "JUN", height: "h-28", active: false },
  { month: "JUL", height: "h-36", active: false },
  { month: "AGO", height: "h-32", active: false },
  { month: "SEP", height: "h-44", active: true },
  { month: "OCT", height: "h-40", active: false },
];

const recentTransactions = [
  {
    student: "Carlos Méndez",
    course: "Pastelería Francesa",
    amount: "$425.00",
    status: "Pagado",
  },
  {
    student: "Lucía Ferrero",
    course: "Administración",
    amount: "$310.00",
    status: "Pendiente",
  },
  {
    student: "Andrés Valerio",
    course: "Chocolatería",
    amount: "$195.00",
    status: "Pagado",
  },
];

const AdminReports = () => {
  return (
    <AdminLayout>
      <main className="bg-[#f6f6f6] min-h-screen p-8">
        {/* HEADER */}
        <div className="mb-10">
          <p className="text-sm text-gray-400 mb-2">
            Administración / Dashboard / Control de Pagos
          </p>

          <h1 className="text-5xl font-bold mb-3">
            Informe de Ventas
          </h1>

          <p className="text-gray-500 text-lg max-w-2xl">
            Análisis detallado de ingresos y tendencias del
            Centro de Capacitación G&G para el periodo actual.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-[32px] border border-gray-200 p-8 mb-8">
          <div className="grid xl:grid-cols-4 gap-6">
            <div>
              <label className="text-xs tracking-widest text-gray-400 font-semibold block mb-3">
                MES DE ANÁLISIS
              </label>

              <select className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200">
                <option>Octubre 2023</option>
              </select>
            </div>

            <div>
              <label className="text-xs tracking-widest text-gray-400 font-semibold block mb-3">
                CURSO O MAESTRÍA
              </label>

              <select className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200">
                <option>Todos los cursos</option>
              </select>
            </div>

            <div>
              <label className="text-xs tracking-widest text-gray-400 font-semibold block mb-3">
                PROFESOR RESPONSABLE
              </label>

              <select className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200">
                <option>Todos los instructores</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-red-600 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-3">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-[32px] p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-red-100 p-3 rounded-2xl">
                <TrendingUp className="text-red-600" />
              </div>

              <span className="text-green-600 font-bold text-sm">
                +12.4%
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-2">
              VENTAS TOTALES
            </p>

            <h2 className="text-4xl font-bold">
              $42,850.00
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Users className="text-blue-600" />
              </div>

              <span className="text-green-600 font-bold text-sm">
                +8%
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-2">
              NUEVOS ALUMNOS
            </p>

            <h2 className="text-4xl font-bold">
              128
            </h2>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <BadgeDollarSign className="text-gray-600" />
              </div>

              <span className="text-red-500 font-bold text-sm">
                -2.1%
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-2">
              GANANCIA PROMEDIO
            </p>

            <h2 className="text-4xl font-bold">
              $334.70
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
              Pastelería
            </h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid xl:grid-cols-2 gap-8 mb-10">
          {/* MONTHLY TREND */}
          <div className="bg-white rounded-[32px] border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">
                Tendencia Mensual
              </h2>

              <span className="text-gray-400 text-2xl">
                •••
              </span>
            </div>

            <div className="flex items-end justify-between h-[260px]">
              {monthlyBars.map((bar, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4"
                >
                  <div
                    className={`${bar.height} w-10 rounded-t-2xl ${
                      bar.active
                        ? "bg-red-600"
                        : "bg-gray-200"
                    }`}
                  />

                  <span
                    className={`text-sm font-semibold ${
                      bar.active
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SALES BY COURSE */}
          <div className="bg-white rounded-[32px] border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">
                Ventas por Curso
              </h2>

              <div className="w-8 h-8 rounded-full border border-gray-300"></div>
            </div>

            <div className="space-y-8">
              {courses.map((course, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-3">
                    <span className="font-medium">
                      {course.name}
                    </span>

                    <span className="font-bold">
                      {course.percentage}
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`${course.width} ${course.color} h-full rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white rounded-[32px] border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Transacciones Recientes
            </h2>

            <button className="text-red-600 font-semibold flex items-center gap-2">
              Exportar a CSV
              <Download size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg">
                    {transaction.student}
                  </h3>

                  <p className="text-gray-400">
                    {transaction.course}
                  </p>
                </div>

                <div className="text-right">
                  <h3 className="font-bold text-xl">
                    {transaction.amount}
                  </h3>

                  <p
                    className={`font-semibold ${
                      transaction.status === "Pagado"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminReports;