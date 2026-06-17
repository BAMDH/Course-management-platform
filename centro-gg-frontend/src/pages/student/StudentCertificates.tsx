import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth/useAuth';
import { getStudentGradesData } from '@/services/studentCertificatesService';
import * as XLSX from 'xlsx';
import {
  Download,
  TrendingUp,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  BookOpen,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function StudentCertificates() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['studentGrades', user?.email],
    queryFn: () => getStudentGradesData(user?.email || ''),
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error cargando las calificaciones. Intenta de nuevo más tarde.
      </div>
    );
  }

  const overallGrade = data?.overallGrade ?? '-';
  const attendancePercentage = data?.attendancePercentage ?? '-';
  const courses = data?.courses ?? [];

  const handleDownload = () => {
    if (courses.length === 0) return;

    const wsData = courses.map(course => ({
      Materia: course.courseTitle,
      Profesor: course.professor,
      Calificación: course.grade,
      Estado: course.status
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");
    XLSX.writeFile(wb, `Historial_Academico_${user?.user_metadata?.full_name?.replace(/\s+/g, '_') || 'Estudiante'}.xlsx`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[32px] font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] leading-tight">
            Mis Calificaciones
          </h1>
          <p className="text-[#5d5e60] text-[15px] mt-2">
            Resumen de tu desempeño académico en Centro De Capacitación G&G.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={courses.length === 0}
          className={clsx(
            "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#1b1c1b] font-bold flex-shrink-0 shadow-sm transition-colors",
            courses.length > 0
              ? "bg-white text-[#1b1c1b] hover:bg-[#f5f3f2]"
              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
          )}
        >
          <Download className="w-[18px] h-[18px]" />
          <span className="text-[14px]">Descargar Historial</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Promedio General */}
        <div className="bg-[#fcfbfb] rounded-3xl p-6 border border-[#e9e8e7] shadow-sm relative overflow-hidden flex flex-col justify-between h-[160px]">
          <GraduationCap className="w-24 h-24 absolute -right-4 -top-2 text-[#dc2626] opacity-10" />
          <div className="relative z-10">
            <h3 className="text-[14px] font-medium text-[#5d5e60] mb-2">Promedio General</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold font-['Manrope',sans-serif] text-[#dc2626] tracking-tight">{overallGrade}</span>
              {overallGrade !== '-' && <span className="text-[16px] text-[#5d5e60] font-bold">/ 10</span>}
            </div>
            {overallGrade !== '-' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[12px] font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                Excelente desempeño
              </div>
            )}
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-[#fcfbfb] rounded-3xl p-6 border border-[#e9e8e7] shadow-sm relative overflow-hidden flex flex-col justify-between h-[160px]">
          <CalendarCheck className="w-24 h-24 absolute -right-4 -top-2 text-[#1b1c1b] opacity-[0.03]" />
          <div className="relative z-10">
            <h3 className="text-[14px] font-medium text-[#5d5e60] mb-2">Asistencia</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] tracking-tight">{attendancePercentage !== '-' ? `${attendancePercentage}%` : '-'}</span>
            </div>
            {attendancePercentage !== '-' && (
              <div className="flex items-center gap-1.5 text-[#5d5e60] text-[13px] font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {data?.attendedSessions} / {data?.totalSessions} sesiones
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desglose por Curso Table */}
      <div className="bg-white rounded-3xl border border-[#e9e8e7] shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 pb-6 border-b border-[#e9e8e7]">
          <h2 className="text-[20px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
            Desglose por Curso
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#fcfbfb] border-b border-[#e9e8e7]">
                <th className="py-4 px-8 text-[13px] font-bold text-[#5d5e60]">Materia</th>
                <th className="py-4 px-8 text-[13px] font-bold text-[#5d5e60]">Calificación</th>
                <th className="py-4 px-8 text-[13px] font-bold text-[#5d5e60]">Estado</th>
                <th className="py-4 px-8 text-[13px] font-bold text-[#5d5e60]">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e8e7]">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-8 text-center text-[#5d5e60] text-[15px]">
                    No tienes cursos inscritos aún.
                  </td>
                </tr>
              ) : (
                courses.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    {/* Materia Col */}
                    <td className="py-5 px-8 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50 text-[#dc2626]">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-[#1b1c1b] leading-tight mb-0.5">{row.courseTitle}</p>
                          <p className="text-[13px] text-[#5d5e60]">{row.professor}</p>
                        </div>
                      </div>
                    </td>

                    {/* Calificación Col */}
                    <td className="py-5 px-8 whitespace-nowrap">
                      <span className="text-[18px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                        {row.grade}
                      </span>
                    </td>

                    {/* Estado Col */}
                    <td className="py-5 px-8 whitespace-nowrap">
                      <div className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold",
                        row.status === 'Aprobado' ? "bg-green-100 text-green-700" :
                          row.status === 'En curso' ? "bg-blue-100 text-blue-700" :
                            "bg-[#e9e8e7] text-[#5d5e60]"
                      )}>
                        <div className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          row.status === 'Aprobado' ? "bg-green-600" :
                            row.status === 'En curso' ? "bg-blue-600" :
                              "bg-[#5d5e60]"
                        )} />
                        {row.status}
                      </div>
                    </td>

                    {/* Acción Col */}
                    <td className="py-5 px-8 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/student/courses/${row.id}/classroom`)}
                        disabled={row.status === 'Próximo'}
                        className={clsx(
                          "text-[14px] font-bold hover:underline",
                          row.status === 'Próximo' ? "text-[#a3a3a3] cursor-not-allowed" : "text-[#dc2626]"
                        )}>
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
