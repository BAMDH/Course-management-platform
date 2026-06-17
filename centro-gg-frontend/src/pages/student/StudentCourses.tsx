import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/auth/useAuth';
import { getStudentCourses, type StudentEnrolledCourse } from '@/services/courseService';
import {
  Filter,
  Search,
  Clock,
  Users,
  MapPin,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';

export default function StudentCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<StudentEnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming'>('all');

  useEffect(() => {
    async function loadCourses() {
      if (user) {
        try {
          const data = await getStudentCourses(user.id);
          setCourses(data);
        } catch (error) {
          console.error("Failed to fetch courses:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadCourses();
    loadCourses();
  }, [user]);

  const filteredCourses = courses.filter(enrollment => {
    const matchesSearch = enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && enrollment.status === 'active') ||
      (filterStatus === 'upcoming' && enrollment.status !== 'active');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b]">
            Mis Cursos Asignados
          </h1>
          <p className="text-[#5d5e60] text-[15px] mt-2">
            Gestiona tus clases y sigue tu progreso académico.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="appearance-none w-full sm:w-auto flex items-center gap-2 pl-10 pr-8 py-2.5 rounded-xl border border-[#e9e8e7] bg-white text-[#5d5e60] font-medium hover:bg-[#f5f3f2] transition-colors shadow-sm focus:outline-none cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="active">En Curso</option>
              <option value="upcoming">Próximamente</option>
            </select>
            <Filter className="w-[18px] h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5e60] pointer-events-none" />
          </div>
          <div className="relative w-full md:w-[280px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar curso..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e9e8e7] bg-white text-[#1b1c1b] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl border border-dashed border-[#a3a3a3] shadow-sm overflow-hidden flex flex-col h-full opacity-60">
            <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
              <span className="bg-[#a3a3a3] px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-white">SIN CURSOS ACTIVOS</span>
            </div>
            <div className="p-6 flex flex-col flex-1 text-center justify-center">
              <h2 className="text-[20px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-2">
                Aún no estás inscrito en ningún curso
              </h2>
              <p className="text-[#5d5e60] text-[14px] mb-6">
                Explora nuestra oferta académica y comienza tu viaje.
              </p>
              <button
                onClick={() => navigate('/courses')}
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold py-2.5 rounded-xl transition-colors text-[14px]"
              >
                Ver Cursos Disponibles
              </button>
            </div>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#e9e8e7] shadow-sm mb-10">
          <p className="text-[#5d5e60] text-lg">No se encontraron cursos con estos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredCourses.map((enrollment) => {
            const course = enrollment.course;
            const isEnCurso = enrollment.status === 'active';
            const displayStatus = isEnCurso ? 'EN CURSO' : 'PRÓXIMAMENTE';
            
            const progress = enrollment.progress || 0;

            return (
              <div key={enrollment.id} className="bg-white rounded-3xl border border-[#e9e8e7] shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                {/* Optional Cover Image */}
                {course.cover_image_path ? (
                  <div className="h-40 w-full relative">
                    <img src={course.cover_image_path} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-white",
                        isEnCurso ? "bg-[#dc2626]" : "bg-white/80 backdrop-blur-sm text-[#1b1c1b]"
                      )}>
                        {displayStatus}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pt-6 pb-2">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-white",
                      isEnCurso ? "bg-[#dc2626]" : "bg-[#a3a3a3]"
                    )}>
                      {displayStatus}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-[20px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-6 line-clamp-2">
                    {course.title}
                  </h2>

                  <div className="space-y-3 mb-8">
                    {course.start_date && (
                      <div className="flex items-center gap-3 text-[#5d5e60]">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[13px]">Inicia: {course.start_date}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[#5d5e60]">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[13px]">Grupo de estudiantes</span>
                    </div>
                    {course.location && (
                      <div className="flex items-center gap-3 text-[#5d5e60]">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[13px]">{course.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[13px] font-bold text-[#1b1c1b]">Progreso</span>
                      <span className={clsx(
                        "text-[14px] font-bold",
                        isEnCurso ? "text-[#dc2626]" : "text-[#5d5e60]"
                      )}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#f5f3f2] rounded-full overflow-hidden mb-6">
                      <div
                        className={clsx(
                          "h-full rounded-full transition-all duration-1000",
                          isEnCurso ? "bg-[#dc2626]" : "bg-[#a3a3a3]"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {isEnCurso ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/student/courses/${course.id}/classroom`)}
                          className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold py-2.5 rounded-xl transition-colors text-[14px]"
                        >
                          Ver Materiales
                        </button>
                      </div>
                    ) : (
                      <button disabled className="w-full bg-[#f5f3f2] text-[#a3a3a3] font-bold py-2.5 rounded-xl text-[14px] cursor-not-allowed">
                        Materiales Bloqueados
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
