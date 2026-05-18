
import AdminLayout from "@/layout/AdminLayout";

const pendingStudents = [
  {
    initials: "AM",
    name: "Adriana Martínez",
  },
  {
    initials: "RL",
    name: "Roberto Luna",
  },
];

const AdminResources = () => {
  return (
    <AdminLayout>
      <main className="bg-[#f6f6f6] min-h-screen p-8">
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">
            Administración / Asignación Recursos
          </p>

          <h1 className="text-5xl font-bold mb-4">
            Asignación de Recursos
          </h1>
        </div>

        <div className="grid xl:grid-cols-[2fr,1fr] gap-8">
          <div className="bg-white rounded-[32px] p-8 border border-gray-200">
            <h2 className="text-3xl font-bold mb-8">
              Configuración
            </h2>

            <div className="space-y-6">
              <select className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200">
                <option>Pastelería Francesa Avanzada</option>
              </select>

              <select className="w-full bg-gray-100 rounded-2xl p-4 border border-gray-200">
                <option>Jean-Luc Petit</option>
              </select>
            </div>

            <div className="mt-10 space-y-4">
              {pendingStudents.map((student, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold text-red-600">
                      {student.initials}
                    </div>

                    <h3 className="font-bold">
                      {student.name}
                    </h3>
                  </div>

                  <div className="flex gap-3">
                    <button className="border border-gray-200 px-5 py-3 rounded-2xl font-semibold">
                      Rechazar
                    </button>

                    <button className="bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold">
                      Aprobar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-gray-200 h-fit">
            <h2 className="text-3xl font-bold mb-6">
              Resumen del Estado
            </h2>

            <img
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba"
              className="rounded-3xl h-52 w-full object-cover"
            />

            <div className="mt-8 space-y-6">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Curso Actual
                </span>

                <span className="font-bold">
                  Pastelería Francesa Avanzada
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Disponibilidad
                </span>

                <span className="text-green-600 font-bold">
                  2 Cupos
                </span>
              </div>
            </div>

            <button className="w-full mt-10 bg-red-600 text-white rounded-2xl py-4 font-semibold">
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminResources;