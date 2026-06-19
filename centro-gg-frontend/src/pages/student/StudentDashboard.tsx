import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/auth/useAuth';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStudentDashboardData } from '@/services/studentDashboardService';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real data from the database
  const { data, isLoading, error } = useQuery({
    queryKey: ['studentDashboard', user?.email],
    queryFn: () => getStudentDashboardData(user?.email || 'estudiante@prueba.com'),
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4 md:p-8">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 text-red-500">
        Error cargando el dashboard. Intenta de nuevo más tarde.
      </div>
    );
  }

  const studentName = user?.user_metadata?.full_name?.split(' ')[0] || 'Estudiante';
  const { ongoingCourses, avatarUrl } = data || {
    ongoingCourses: [],
    avatarUrl: null
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4 md:space-y-8 font-['Inter',sans-serif]">
      {/* Welcome Banner */}
      <section className="bg-[#f5f3f2] rounded-3xl p-4 md:p-8 relative overflow-hidden flex justify-between items-center shadow-sm">
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
            {ongoingCourses.length > 0 
              ? `Actualmente estás inscrito en ${ongoingCourses.length} curso(s). ¡Sigue aprendiendo y mejorando tus habilidades!`
              : "No tienes cursos activos en este momento. ¡Explora nuestras opciones!"}
          </p>
        </div>

        {/* Profile Image */}
        <div className="hidden md:block w-32 h-32 absolute right-12 top-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-md border-4 border-white/80 z-0">
          <img
            src={avatarUrl || "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200"}
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">Mis Cursos</h2>
          <button 
            onClick={() => navigate('/student/courses')}
            className="text-sm font-bold text-[#dc2626] hover:underline"
          >
            Ver todos
          </button>
        </div>

        {ongoingCourses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-[#a3a3a3] shadow-sm overflow-hidden flex flex-col items-center justify-center py-12 px-6 text-center h-[300px]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 font-bold text-xl">!</span>
            </div>
            <h2 className="text-[20px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-2">
              Aún no estás inscrito en ningún curso
            </h2>
            <p className="text-[#5d5e60] text-[14px] mb-6 max-w-sm">
              Explora nuestra oferta académica y comienza tu viaje culinario.
            </p>
            <button 
              onClick={() => navigate('/courses')}
              className="bg-[#dc2626] hover:bg-[#b91c1c] px-6 text-white font-bold py-2.5 rounded-xl transition-colors text-[14px]"
            >
              Ver Cursos Disponibles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingCourses.map(course => (
              <div 
                key={course.id} 
                onClick={() => navigate(`/student/courses/${course.id}/classroom`)}
                className="bg-white rounded-3xl p-4 shadow-sm border border-[#e9e8e7] flex flex-col hover:shadow-md transition-shadow cursor-pointer"
              >
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
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
