import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  BarChart2, 
  CheckCircle2 
} from 'lucide-react';
import clsx from 'clsx';

interface Course {
  id: string;
  title: string;
  status: 'EN CURSO' | 'PRÓXIMAMENTE';
  schedule: string;
  group: string;
  location: string;
  progress: number;
  imageUrl?: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: 'pasteleria-basica',
    title: 'Pastelería Básica',
    status: 'EN CURSO',
    schedule: 'Martes 9:00 AM - 12:00 PM',
    group: 'Grupo A - 24 Compañeros',
    location: 'Cocina Principal',
    progress: 75,
  },
  {
    id: 'chocolateria-n1',
    title: 'Taller de Chocolatería N1',
    status: 'EN CURSO',
    schedule: 'Jueves 2:00 PM - 5:00 PM',
    group: 'Grupo B - 18 Compañeros',
    location: 'Laboratorio Frío',
    progress: 40,
    imageUrl: 'https://images.unsplash.com/photo-1548843269-9da8b6282121?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'chocolateria-avanzada',
    title: 'Chocolatería Fina Avanzada',
    status: 'PRÓXIMAMENTE',
    schedule: 'Inicia: 15 de Octubre',
    group: 'Grupo único - 12 Cupos',
    location: 'Laboratorio Frío VIP',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1614088657688-6ef81e28fa03?auto=format&fit=crop&q=80&w=800'
  }
];

export default function StudentCourses() {
  const navigate = useNavigate();

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

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e9e8e7] bg-white text-[#5d5e60] font-medium hover:bg-[#f5f3f2] transition-colors flex-shrink-0 shadow-sm">
            <Filter className="w-[18px] h-[18px]" />
            <span className="text-[14px]">Filtrar</span>
          </button>
          <div className="relative w-full md:w-[280px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
            <input 
              type="text" 
              placeholder="Buscar curso..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e9e8e7] bg-white text-[#1b1c1b] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {MOCK_COURSES.map((course) => (
          <div key={course.id} className="bg-white rounded-3xl border border-[#e9e8e7] shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            {/* Optional Cover Image */}
            {course.imageUrl ? (
              <div className="h-40 w-full relative">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-white",
                    course.status === 'EN CURSO' ? "bg-[#dc2626]" : "bg-white/80 backdrop-blur-sm text-[#1b1c1b]"
                  )}>
                    {course.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-6 pt-6 pb-2">
                <span className={clsx(
                  "px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-white",
                  course.status === 'EN CURSO' ? "bg-[#dc2626]" : "bg-[#a3a3a3]"
                )}>
                  {course.status}
                </span>
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-[20px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-6 line-clamp-2">
                {course.title}
              </h2>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-[#5d5e60]">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[13px]">{course.schedule}</span>
                </div>
                <div className="flex items-center gap-3 text-[#5d5e60]">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[13px]">{course.group}</span>
                </div>
                <div className="flex items-center gap-3 text-[#5d5e60]">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[13px]">{course.location}</span>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[13px] font-bold text-[#1b1c1b]">Progreso</span>
                  <span className={clsx(
                    "text-[14px] font-bold",
                    course.status === 'EN CURSO' ? "text-[#dc2626]" : "text-[#5d5e60]"
                  )}>
                    {course.progress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-[#f5f3f2] rounded-full overflow-hidden mb-6">
                  <div 
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000",
                      course.status === 'EN CURSO' ? "bg-[#dc2626]" : "bg-[#a3a3a3]"
                    )}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                {course.status === 'EN CURSO' ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/student/courses/${course.id}/classroom`)}
                      className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold py-2.5 rounded-xl transition-colors text-[14px]"
                    >
                      Ver Materiales
                    </button>
                    <button className="flex-1 bg-white border border-[#e9e8e7] text-[#1b1c1b] hover:bg-[#f5f3f2] font-bold py-2.5 rounded-xl transition-colors text-[14px]">
                      Calificaciones
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
        ))}
      </div>

      {/* Bottom Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e9e8e7] shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-[#dc2626] fill-[#dc2626]" />
          </div>
          <div>
            <div className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] leading-tight">
              4.9
            </div>
            <p className="text-[14px] text-[#5d5e60] font-medium">Promedio Calificación</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e9e8e7] shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <BarChart2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] leading-tight">
              92%
            </div>
            <p className="text-[14px] text-[#5d5e60] font-medium">Tasa de Asistencia</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e9e8e7] shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] leading-tight">
              55
            </div>
            <p className="text-[14px] text-[#5d5e60] font-medium">Tareas Entregadas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
