import { useAuth } from '@/providers/auth/useAuth';
import { Award, CalendarDays, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStudentDashboardData } from '@/services/studentDashboardService';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Fetch real data from the database
  const { data, isLoading, error } = useQuery({
    queryKey: ['studentDashboard', user?.email],
    queryFn: () => getStudentDashboardData(user?.email || 'estudiante@prueba.com'),
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error cargando el dashboard. Intenta de nuevo más tarde.
      </div>
    );
  }

  const studentName = user?.user_metadata?.full_name?.split(' ')[0];
  const { generalAverage, hoursCompleted, ongoingCourses } = data || {
    generalAverage: 0,
    hoursCompleted: 0,
    ongoingCourses: []
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-['Inter',sans-serif]">
      {/* Welcome Banner */}
      <section className="bg-[#f5f3f2] rounded-3xl p-8 relative overflow-hidden flex justify-between items-center shadow-sm">
        <div className="z-10 max-w-xl space-y-6">
          <div>
            <span className="text-[#dc2626] font-bold text-xs tracking-widest uppercase mb-2 block">
              PANEL ACADÉMICO
            </span>
            <h1 className="text-4xl font-['Manrope',sans-serif] font-extrabold text-[#1b1c1b] tracking-tight leading-tight">
              Bienvenido de nuevo,<br />
              <span className="text-[#dc2626]">{studentName}</span>
            </h1>
          </div>

          <p className="text-[#5d5e60] text-[15px] leading-relaxed max-w-md">
            Tu progreso culinario va por excelente camino. Hoy tienes 2 lecciones pendientes en el Módulo de Repostería Francesa.
          </p>

          <div className="flex gap-4 pt-2">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-[#e9e8e7]">
              <div className="text-2xl font-bold text-[#1b1c1b]">{generalAverage}%</div>
              <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider mt-1">Promedio General</div>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-[#e9e8e7]">
              <div className="text-2xl font-bold text-[#1b1c1b]">{hoursCompleted}</div>
              <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider mt-1">Horas Cursadas</div>
            </div>
          </div>
        </div>

        {/* Decorative Chef Image */}
        <div className="hidden md:block w-[300px] h-[300px] absolute right-8 bottom-[-40px] transform rotate-[-2deg] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 z-0">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400"
            alt="Chef"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Bento Grid layout for Courses and Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Mis Cursos (Takes 2 columns) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">Mis Cursos</h2>
            <button className="text-sm font-bold text-[#dc2626] hover:underline">Ver todos</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ongoingCourses.map(course => (
              <div key={course.id} className="bg-white rounded-3xl p-4 shadow-sm border border-[#e9e8e7] flex flex-col hover:shadow-md transition-shadow">
                <div className="h-40 rounded-2xl overflow-hidden mb-4 relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                </div>
                <div className="flex-1 px-2 pb-2 flex flex-col">
                  <span className="bg-[#f5f3f2] text-[#5d5e60] text-[10px] font-bold uppercase px-3 py-1 rounded-full self-start mb-3">
                    {course.module}
                  </span>
                  <h3 className="font-bold text-[#1b1c1b] mb-4 flex-1 line-clamp-2">{course.title}</h3>

                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#5d5e60]">Progreso</span>
                      <span className="text-[#dc2626]">{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#f5f3f2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#dc2626] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Accesos Rápidos (Takes 1 column) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">Accesos Rápidos</h2>

          <div className="bg-[#f5f3f2] rounded-3xl p-6 shadow-sm flex flex-col gap-6">

            {/* Camino a la Certificación */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e9e8e7]">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#dc2626]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-[#1b1c1b]">Camino a la<br />Certificación</h4>
                    <span className="font-bold text-[#dc2626] text-sm">75%</span>
                  </div>
                  <div className="h-2 w-full bg-[#f5f3f2] rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#dc2626] rounded-full w-[75%]" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#5d5e60] font-medium italic">
                ¡Sólo te falta completar 1 módulo más para tu diploma!
              </p>
            </div>

            {/* Próximos Eventos */}
            <div>
              <h3 className="text-xs font-bold text-[#5d5e60] tracking-wider uppercase mb-4">Próximos Eventos</h3>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="bg-white rounded-xl shadow-sm border border-[#e9e8e7] w-14 h-14 flex flex-col items-center justify-center flex-shrink-0 group-hover:border-[#dc2626] transition-colors">
                  <span className="text-[#dc2626] text-[10px] font-bold uppercase">Oct</span>
                  <span className="text-[#1b1c1b] font-bold text-lg leading-none">24</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1b1c1b] group-hover:text-[#dc2626] transition-colors">Masterclass: Macarons</h4>
                  <div className="flex items-center gap-1 text-xs text-[#5d5e60] mt-1">
                    <CalendarDays className="w-3 h-3" />
                    <span>18:00 hrs • Zoom</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default StudentDashboard;
