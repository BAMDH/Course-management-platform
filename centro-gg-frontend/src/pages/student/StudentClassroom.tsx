import { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth/useAuth';
import { getStudentClassroomData, type CourseMaterial } from '@/services/studentClassroomService';
import { supabase } from '@/services/supabase';
import { 
  ChevronRight, 
  User, 
  Calendar, 
  Search, 
  Eye, 
  Download, 
  CheckCircle2,
  Loader2,
  Bell,
  Lock,
  Clock
} from 'lucide-react';
import clsx from 'clsx';

export default function StudentClassroom() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Materiales');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['studentClassroom', courseId, user?.email],
    queryFn: () => getStudentClassroomData(courseId || '', user?.email || ''),
    enabled: !!courseId && !!user?.email,
  });

  const tabs = ['Materiales', 'Anuncios', 'Información'];

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  if (error || !data || !data.course) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4 md:p-8 text-center">
        <h2 className="text-2xl font-bold text-[#1b1c1b] mb-2">Error al cargar el aula virtual</h2>
        <p className="text-[#5d5e60] mb-6">No se pudo cargar la información del curso.</p>
        <Link to="/student/courses" className="bg-[#dc2626] text-white px-6 py-2.5 rounded-full font-bold">
          Volver a mis cursos
        </Link>
      </div>
    );
  }

  const { course, materials, announcements } = data;

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenMaterial = async (mat: CourseMaterial) => {
    if (!mat.isUnlocked) return;
    if (mat.external_url) {
      window.open(mat.external_url, '_blank');
      return;
    }
    if (mat.file_path) {
      const { data, error } = await supabase.storage.from('course-materials').createSignedUrl(mat.file_path, 600);
      if (error) {
        alert("Error al abrir el archivo.");
      } else if (data) {
        window.open(data.signedUrl, '_blank');
      }
    }
  };



  const getMaterialLabel = (kind: string) => {
    switch(kind) {
      case 'video': return 'VIDEO';
      case 'recipe': return 'RECETA';
      case 'document': return 'DOCUMENTO';
      case 'link': return 'ENLACE';
      case 'extra': return 'EXTRA';
      default: return 'ARCHIVO';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Por definir';
    return new Date(dateString).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto font-['Inter',sans-serif]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] font-medium text-[#5d5e60] mb-8">
        <Link to="/student/courses" className="hover:text-[#dc2626] transition-colors">Mis cursos</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Aula virtual</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1b1c1b] font-bold">{course.title}</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 md:gap-8 items-start">
        {/* Main Content Column */}
        <div className="flex-1 w-full text-sm md:text-base min-w-0">
          
          {/* Header Section */}
          <div className="bg-white rounded-3xl p-4 md:p-8 border border-[#e9e8e7] shadow-sm mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-[28px] font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] leading-tight mb-4">
                {course.title}
              </h1>
              <p className="text-[#5d5e60] text-[15px] leading-relaxed mb-6 max-w-3xl">
                Los materiales se desbloquean a medida que se registra tu asistencia en las clases presenciales.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-[14px]">
                <div className="flex items-center gap-2 bg-[#f5f3f2] px-4 py-2 rounded-full text-[#1b1c1b] font-medium">
                  <User className="w-4 h-4 text-[#dc2626]" />
                  Prof. {course.teacherName}
                </div>
                <div className="hidden sm:block w-px h-5 bg-[#e9e8e7]" />
                <div className="flex items-center gap-2 bg-[#f5f3f2] px-4 py-2 rounded-full text-[#1b1c1b] font-medium">
                  <Calendar className="w-4 h-4 text-[#dc2626]" />
                  Próxima clase: {formatDate(course.nextClassDate)}
                </div>
              </div>
            </div>
            {course.cover_image_path && (
              <div className="absolute top-0 right-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
                <img src={course.cover_image_path} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-4 md:gap-8 border-b border-[#e9e8e7] mb-8 overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "pb-4 text-[15px] font-bold whitespace-nowrap transition-colors relative",
                  activeTab === tab 
                    ? "text-[#dc2626]" 
                    : "text-[#5d5e60] hover:text-[#1b1c1b]"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#dc2626] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content - Materiales */}
          {activeTab === 'Materiales' && (
            <div className="space-y-6">
              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="BUSCAR MATERIAL" 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e9e8e7] bg-white text-[13px] font-bold text-[#1b1c1b] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#dc2626] transition-colors"
                  />
                </div>
              </div>

              {/* Material Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMaterials.length === 0 ? (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-[#e9e8e7] rounded-3xl">
                    <p className="text-[#5d5e60] font-medium text-lg">No hay materiales disponibles</p>
                  </div>
                ) : (
                  filteredMaterials.map((mat) => (
                    <div key={mat.id} className={clsx(
                      "rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all",
                      !mat.isUnlocked ? "bg-[#f5f3f2] border-transparent border-dashed border-2 hover:border-[#a3a3a3]" : "bg-white border-[#e9e8e7] hover:shadow-md"
                    )}>
                      {/* Card Content Area */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <span className={clsx(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase",
                            !mat.isUnlocked ? "bg-white text-[#5d5e60]" : "bg-red-50 text-[#dc2626]"
                          )}>
                            {getMaterialLabel(mat.kind)}
                          </span>
                          {mat.course_sessions && (
                            <span className={clsx(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold",
                              !mat.isUnlocked ? "bg-white text-[#5d5e60]" : "bg-[#f5f3f2] text-[#5d5e60]"
                            )}>
                              {mat.course_sessions.title}
                            </span>
                          )}
                          {mat.is_extra_purchase && (
                            <span className="bg-[#fff7ed] px-2.5 py-1 rounded-md text-[10px] font-bold text-[#c2410c]">
                              EXTRA
                            </span>
                          )}
                        </div>

                        <h3 className={clsx(
                          "text-[18px] font-bold font-['Manrope',sans-serif] leading-tight mb-2",
                          !mat.isUnlocked ? "text-[#a3a3a3]" : "text-[#1b1c1b]"
                        )}>
                          {mat.title}
                        </h3>
                        <p className={clsx(
                          "text-[14px] leading-relaxed mb-6",
                          !mat.isUnlocked ? "text-[#a3a3a3]" : "text-[#5d5e60]"
                        )}>
                          {mat.description || "Sin descripción"}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          {mat.isUnlocked ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[12px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Disponible
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#5d5e60] rounded-full text-[12px] font-bold">
                              <Clock className="w-3.5 h-3.5" />
                              Próximamente
                            </div>
                          )}

                          <div className="flex gap-2">
                            {mat.isUnlocked ? (
                              mat.kind === 'video' ? (
                                <button onClick={() => handleOpenMaterial(mat)} className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-xl text-[13px] font-bold transition-colors">
                                  Reproducir
                                </button>
                              ) : (
                                <>
                                  <button onClick={() => handleOpenMaterial(mat)} className="p-2 text-[#5d5e60] hover:bg-[#f5f3f2] rounded-lg transition-colors" title="Ver">
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleOpenMaterial(mat)} className="p-2 text-[#dc2626] hover:bg-red-50 rounded-lg transition-colors" title="Descargar">
                                    <Download className="w-5 h-5" />
                                  </button>
                                </>
                              )
                            ) : (
                              <button disabled className="p-2 text-[#a3a3a3] rounded-lg cursor-not-allowed">
                                <Lock className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab Content - Información */}
          {activeTab === 'Información' && (
            <div className="bg-white rounded-3xl p-4 md:p-8 border border-[#e9e8e7] shadow-sm">
              <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-4">Información del Curso</h2>
              <div className="prose max-w-none text-[#5d5e60]">
                {course.description ? (
                  <p className="whitespace-pre-wrap">{course.description}</p>
                ) : (
                  <p>No hay descripción registrada para este curso.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab Content - Anuncios */}
          {activeTab === 'Anuncios' && (
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-[#e9e8e7] rounded-3xl">
                  <p className="text-[#5d5e60] font-medium text-lg">No hay anuncios para este curso</p>
                </div>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className="bg-white rounded-3xl p-6 border border-[#e9e8e7] shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[18px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">{ann.title}</h3>
                      <span className="text-xs text-[#a3a3a3]">{formatDate(ann.created_at)}</span>
                    </div>
                    <p className="text-[14px] text-[#5d5e60] whitespace-pre-wrap">{ann.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[320px] flex flex-col gap-6 flex-shrink-0">
          
          {/* Estado del Curso */}
          <div className="bg-white rounded-3xl p-6 border border-[#e9e8e7] shadow-sm">
            <h3 className="text-[16px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-4">
              Estado del Curso
            </h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-[#f5f3f2] rounded-2xl p-4 text-center">
                <div className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] mb-1">{materials.length}</div>
                <div className="text-[10px] font-bold text-[#5d5e60] tracking-wider uppercase">Materiales<br/>Totales</div>
              </div>
              <div className="flex-1 bg-[#f5f3f2] rounded-2xl p-4 text-center">
                <div className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#dc2626] mb-1">{materials.filter(m => m.isUnlocked).length}</div>
                <div className="text-[10px] font-bold text-[#dc2626] tracking-wider uppercase">Materiales<br/>Disponibles</div>
              </div>
            </div>
          </div>

          {/* Último Anuncio */}
          {announcements.length > 0 && (
            <div className="bg-[#fffbeb] rounded-3xl p-6 border border-[#fef3c7] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fef3c7] rounded-full -mr-12 -mt-12 blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-[#d97706]" />
                  <h3 className="text-[15px] font-bold font-['Manrope',sans-serif] text-[#92400e]">
                    Último Anuncio
                  </h3>
                </div>
                <p className="text-[14px] text-[#92400e] leading-relaxed mb-4 line-clamp-3">
                  {announcements[0].content}
                </p>
                <button onClick={() => setActiveTab('Anuncios')} className="text-[14px] font-bold text-[#d97706] hover:text-[#b45309] transition-colors flex items-center gap-1">
                  Ver todos <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
