import { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronRight, 
  User, 
  Calendar, 
  Search, 
  ChevronDown, 
  Eye, 
  Download, 
  PlayCircle, 
  Lock, 
  Clock, 
  FileText, 
  ShoppingCart, 
  Megaphone, 
  Bell,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

interface MaterialCard {
  id: string;
  type: 'PDF' | 'DOC' | 'VIDEO' | 'LOCKED';
  classNum: string;
  title: string;
  description: string;
  status: 'Disponible' | 'Próximamente';
  imageUrl?: string;
}

const MOCK_MATERIALS: MaterialCard[] = [
  {
    id: 'm1',
    type: 'PDF',
    classNum: 'CLASE 1',
    title: 'Receta 01 - Masa base de vainilla',
    description: 'Receta detallada con gramajes exactos y procedimiento paso a paso',
    status: 'Disponible',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm2',
    type: 'DOC',
    classNum: 'CLASE 1',
    title: 'Receta 02 - Relleno de crema pastelera',
    description: 'Documento de texto con las proporciones ideales para una crema',
    status: 'Disponible',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm3',
    type: 'VIDEO',
    classNum: 'CLASE 2',
    title: 'Receta 03 - Decoración con manga',
    description: 'Video demostrativo de técnicas básicas de boquilla: rosetones,...',
    status: 'Disponible',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'm4',
    type: 'LOCKED',
    classNum: 'CLASE 2',
    title: 'Receta 04 - Cupcakes de chocolate',
    description: 'Receta y tips de horneado para cupcakes húmedos.',
    status: 'Próximamente'
  }
];

export default function StudentClassroom() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('Materiales');

  const tabs = ['Materiales', 'Anuncios', 'Información', 'Tareas'];

  return (
    <div className="p-8 max-w-[1400px] mx-auto font-['Inter',sans-serif]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] font-medium text-[#5d5e60] mb-8">
        <Link to="/student/courses" className="hover:text-[#dc2626] transition-colors">Mis cursos</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Aula virtual</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1b1c1b] font-bold">Pastelería Básica</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Main Content Column */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Header Section */}
          <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm mb-8">
            <h1 className="text-[28px] font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] leading-tight mb-4">
              Pastelería Básica • Recetas y materiales de clase
            </h1>
            <p className="text-[#5d5e60] text-[15px] leading-relaxed mb-6 max-w-3xl">
              Encuentra aquí todas las recetas, guías paso a paso y videos demostrativos correspondientes a cada módulo. Los materiales se desbloquean a medida que avanzamos en las clases en vivo.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-[14px]">
              <div className="flex items-center gap-2 bg-[#f5f3f2] px-4 py-2 rounded-full text-[#1b1c1b] font-medium">
                <User className="w-4 h-4 text-[#dc2626]" />
                Prof. Elena Gómez
              </div>
              <div className="hidden sm:block w-px h-5 bg-[#e9e8e7]" />
              <div className="flex items-center gap-2 bg-[#f5f3f2] px-4 py-2 rounded-full text-[#1b1c1b] font-medium">
                <Calendar className="w-4 h-4 text-[#dc2626]" />
                Próxima clase: 12 mayo
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-8 border-b border-[#e9e8e7] mb-8 overflow-x-auto hide-scrollbar">
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
                    placeholder="BUSCAR MATERIAL" 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e9e8e7] bg-white text-[13px] font-bold text-[#1b1c1b] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#dc2626] transition-colors"
                  />
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-[#e9e8e7] bg-white text-[13px] font-bold text-[#5d5e60] hover:bg-[#f5f3f2] transition-colors min-w-[180px]">
                    FILTRAR POR CLASE
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-[#e9e8e7] bg-white text-[13px] font-bold text-[#5d5e60] hover:bg-[#f5f3f2] transition-colors min-w-[180px]">
                    TIPO DE MATERIAL
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Material Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_MATERIALS.map((mat) => (
                  <div key={mat.id} className={clsx(
                    "rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all",
                    mat.type === 'LOCKED' ? "bg-[#f5f3f2] border-transparent border-dashed border-2 hover:border-[#a3a3a3]" : "bg-white border-[#e9e8e7] hover:shadow-md"
                  )}>
                    {/* Card Image Area */}
                    <div className="h-[180px] w-full relative bg-[#e9e8e7]">
                      {mat.imageUrl && (
                        <img src={mat.imageUrl} alt={mat.title} className={clsx(
                          "w-full h-full object-cover",
                          mat.type === 'VIDEO' ? "brightness-75" : ""
                        )} />
                      )}
                      
                      {mat.type === 'VIDEO' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white/80" />
                        </div>
                      )}

                      {mat.type === 'LOCKED' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="w-10 h-10 text-[#a3a3a3]" />
                        </div>
                      )}

                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white px-2.5 py-1 rounded-md text-[10px] font-bold text-[#1b1c1b]">
                          {mat.type === 'LOCKED' ? 'PDF' : mat.type}
                        </span>
                        <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white">
                          {mat.classNum}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className={clsx(
                        "text-[18px] font-bold font-['Manrope',sans-serif] leading-tight mb-2",
                        mat.type === 'LOCKED' ? "text-[#a3a3a3]" : "text-[#1b1c1b]"
                      )}>
                        {mat.title}
                      </h3>
                      <p className={clsx(
                        "text-[14px] leading-relaxed mb-6",
                        mat.type === 'LOCKED' ? "text-[#a3a3a3]" : "text-[#5d5e60]"
                      )}>
                        {mat.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        {mat.status === 'Disponible' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[12px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {mat.status}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e9e8e7] text-[#5d5e60] rounded-full text-[12px] font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {mat.status}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {mat.type === 'VIDEO' ? (
                            <button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-xl text-[13px] font-bold transition-colors">
                              Reproducir
                            </button>
                          ) : mat.type !== 'LOCKED' ? (
                            <>
                              <button className="p-2 text-[#5d5e60] hover:bg-[#f5f3f2] rounded-lg transition-colors">
                                <Eye className="w-5 h-5" />
                              </button>
                              <button className="p-2 text-[#dc2626] hover:bg-red-50 rounded-lg transition-colors">
                                <Download className="w-5 h-5" />
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'Materiales' && (
            <div className="py-12 text-center border-2 border-dashed border-[#e9e8e7] rounded-3xl">
              <p className="text-[#5d5e60] font-medium text-lg">Contenido de {activeTab} en construcción</p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[320px] flex flex-col gap-6 flex-shrink-0">
          
          {/* Acceso Rápido */}
          <div className="bg-white rounded-3xl p-6 border border-[#e9e8e7] shadow-sm">
            <h3 className="text-[16px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-4">
              Acceso Rápido
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#dc2626] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[14px] font-bold text-[#dc2626] text-left leading-tight">
                    Descargar recetario completo
                  </span>
                </div>
                <Download className="w-4 h-4 text-[#dc2626] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-white hover:bg-[#f5f3f2] border border-[#e9e8e7] rounded-2xl transition-colors">
                <div className="w-8 h-8 bg-[#f5f3f2] rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 text-[#dc2626]" />
                </div>
                <span className="text-[14px] font-bold text-[#1b1c1b] text-left leading-tight">
                  Ver ingredientes de la semana
                </span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-white hover:bg-[#f5f3f2] border border-[#e9e8e7] rounded-2xl transition-colors">
                <div className="w-8 h-8 bg-[#f5f3f2] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <span className="text-[14px] font-bold text-[#1b1c1b] text-left leading-tight">
                  Abrir anuncio reciente
                </span>
              </button>
            </div>
          </div>

          {/* Estado del Curso */}
          <div className="bg-white rounded-3xl p-6 border border-[#e9e8e7] shadow-sm">
            <h3 className="text-[16px] font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-4">
              Estado del Curso
            </h3>
            <div className="flex gap-4">
              <div className="flex-1 bg-[#f5f3f2] rounded-2xl p-4 text-center">
                <div className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] mb-1">12</div>
                <div className="text-[10px] font-bold text-[#5d5e60] tracking-wider uppercase">Materiales<br/>Public.</div>
              </div>
              <div className="flex-1 bg-[#f5f3f2] rounded-2xl p-4 text-center">
                <div className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#dc2626] mb-1">4</div>
                <div className="text-[10px] font-bold text-[#dc2626] tracking-wider uppercase">Recetas<br/>Descarg.</div>
              </div>
            </div>
          </div>

          {/* Último Anuncio */}
          <div className="bg-[#fffbeb] rounded-3xl p-6 border border-[#fef3c7] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#fef3c7] rounded-full -mr-12 -mt-12 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-[#d97706]" />
                <h3 className="text-[15px] font-bold font-['Manrope',sans-serif] text-[#92400e]">
                  Último Anuncio
                </h3>
              </div>
              <p className="text-[14px] text-[#92400e] leading-relaxed mb-4">
                Recuerden que para la clase del sábado deben tener pesados los ingredientes de la Receta 01.
              </p>
              <button className="text-[14px] font-bold text-[#d97706] hover:text-[#b45309] transition-colors flex items-center gap-1">
                Leer más <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
