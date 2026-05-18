
import AdminLayout from "@/layout/AdminLayout";

const students = [
  {
    initials: "SA",
    name: "Sofia Alarcón",
    attendance: "11 de 12 clases",
    percentage: 92,
    status: "Excelente",
  },
  {
    initials: "MV",
    name: "Marco Valdivia",
    attendance: "8 de 12 clases",
    percentage: 66,
    status: "Regular",
  },
];

const AdminStudentsAttendance = () => {
  return (
    <AdminLayout>
      <main className="bg-[#f6f6f6] min-h-screen p-8">
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">
            Administración / Asistencia por Alumno
          </p>

          <h1 className="text-5xl font-bold mb-4">
            Asistencia por Alumno
          </h1>
        </div>

        <div className="space-y-6">
          {students.map((student, index) => (
            <div
              key={index}
              className="bg-white rounded-[28px] p-6 border border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-red-600">
                  {student.initials}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    {student.name}
                  </h2>
                </div>
              </div>

              <div className="w-96">
                <div className="flex justify-between mb-2">
                  <span>{student.attendance}</span>
                  <span className="font-bold">
                    {student.percentage}%
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${student.percentage}%` }}
                  ></div>
                </div>
              </div>

              <span className="bg-gray-100 px-4 py-2 rounded-full font-semibold">
                • {student.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminStudentsAttendance;