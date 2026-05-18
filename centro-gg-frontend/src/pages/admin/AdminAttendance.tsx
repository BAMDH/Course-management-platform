import AdminLayout from "@/layout/AdminLayout";

const courses = [
  {
    title: "Pastelería de Alta Gama",
    level: "Avanzado",
    attendance: "92%",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  },
  {
    title: "Panadería Artesanal",
    level: "Inicial",
    attendance: "78%",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff",
  },
];

const AdminAttendance = () => {
  return (
    <AdminLayout>
      <main className="bg-[#f6f6f6] min-h-screen p-8">
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">
            Administración / Informe de Asistencias
          </p>

          <h1 className="text-5xl font-bold mb-4">
            Informe de Asistencia
          </h1>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-[28px] overflow-hidden border border-gray-200"
            >
              <img
                src={course.image}
                className="h-52 w-full object-cover"
              />

              <div className="p-6">
                <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
                  Nivel: {course.level}
                </span>

                <h2 className="text-2xl font-bold mt-4">
                  {course.title}
                </h2>

                <div className="flex justify-between mt-6 mb-3">
                  <span className="text-gray-500">
                    Tasa de Asistencia
                  </span>

                  <span className="font-bold text-red-600">
                    {course.attendance}
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-red-600"></div>
                </div>

                <button className="w-full border border-gray-200 rounded-2xl py-3 mt-6 font-semibold">
                  Ver Alumnos
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminAttendance;