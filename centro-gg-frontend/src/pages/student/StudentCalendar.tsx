import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth/useAuth';
import { getStudentCalendarEvents, getRecommendedClass } from '@/services/studentCalendarService';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  School,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';

export default function StudentCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['studentCalendar', user?.email, year, month],
    queryFn: () => getStudentCalendarEvents(user?.email || '', year, month),
    enabled: !!user?.email,
  });

  const { data: recommendedClass } = useQuery({
    queryKey: ['recommendedClass', user?.email],
    queryFn: () => getRecommendedClass(user?.email || ''),
    enabled: !!user?.email,
  });

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Previous month trailing days
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1);

  const renderCalendarDay = (dayNum: number) => {
    // Determine the state of this specific day
    const dayEvents = events.filter(e => e.date === dayNum);
    
    const isPastEvent = dayEvents.some(e => e.type === 'past');
    const isUpcoming = dayEvents.some(e => e.type === 'upcoming');
    const isFutureEvent = dayEvents.some(e => e.type === 'future');
    const isEvalEvent = dayEvents.some(e => e.type === 'evaluation');

    let baseClasses = "relative w-full aspect-square flex flex-col items-center justify-center text-sm font-medium rounded-xl transition-colors cursor-pointer ";
    let textClasses = "text-[#1b1c1b] ";
    let iconOrDot = null;

    if (isPastEvent) {
      baseClasses += "bg-[#f5f3f2] ";
      iconOrDot = <div className="w-1.5 h-1.5 rounded-full bg-[#5d5e60] mt-1" />;
    } else if (isUpcoming) {
      baseClasses += "bg-[#dc2626] shadow-md shadow-red-500/20 ";
      textClasses = "text-white font-bold ";
      iconOrDot = <School className="w-4 h-4 text-white mt-1" />;
    } else if (isFutureEvent) {
      baseClasses += "border border-[#dc2626] ";
      textClasses += "text-[#dc2626] font-bold ";
      iconOrDot = <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] mt-1" />;
    } else if (isEvalEvent) {
      baseClasses += "border border-[#e9e8e7] bg-white ";
      iconOrDot = <CheckCircle2 className="w-4 h-4 text-[#5d5e60] mt-1" />;
    } else {
      baseClasses += "hover:bg-slate-50 ";
    }

    const today = new Date();
    const isToday = today.getDate() === dayNum && today.getMonth() === month && today.getFullYear() === year;

    if (isToday) {
      baseClasses += " ring-2 ring-[#dc2626] ring-offset-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] ";
    }

    return (
      <div key={`day-${dayNum}`} className="p-1">
        <div className={baseClasses}>
          <span className={textClasses}>{dayNum}</span>
          {iconOrDot}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b]">
            Calendario de Clases
          </h1>
          <p className="text-[#5d5e60] text-sm mt-1">
            Centro De Capacitación G&G - {monthNames[month]} {year}
          </p>
        </div>
        <div className="bg-[#f5f3f2] px-4 py-2 rounded-full text-sm font-medium text-[#5d5e60]">
          {events.length > 0 ? 'Clases Activas' : 'Sin clases registradas'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Left Column: Calendar & Banner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-3xl p-4 md:p-8 border border-[#e9e8e7] shadow-sm">
            {/* Month Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                {monthNames[month]}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-1.5 text-[#5d5e60] hover:bg-[#f5f3f2] rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-1.5 text-[#5d5e60] hover:bg-[#f5f3f2] rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-[11px] font-bold text-[#5d5e60] tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-2">
              {/* Empty leading days (Trailing previous month) */}
              {prevMonthDays.map((day, idx) => (
                <div key={`prev-${idx}`} className="p-1">
                  <div className="w-full aspect-square flex items-center justify-center text-sm font-medium text-[#a3a3a3]">
                    {day}
                  </div>
                </div>
              ))}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => renderCalendarDay(i + 1))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-[#e9e8e7]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                <span className="text-xs text-[#5d5e60] font-medium">Próxima Clase</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5d5e60]" />
                <span className="text-xs text-[#5d5e60] font-medium">Asistencia Registrada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border border-[#5d5e60]" />
                <span className="text-xs text-[#5d5e60] font-medium">Día de Evaluación</span>
              </div>
            </div>
          </div>

          {/* Special Banner */}
          {recommendedClass && (
            <div 
              onClick={() => navigate(`/courses/${recommendedClass.id}`)}
              className="relative overflow-hidden rounded-3xl h-[160px] shadow-sm group cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/30 transition-colors" />
              <img 
                src={recommendedClass.imageUrl} 
                alt={recommendedClass.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <div className="bg-[#dc2626] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider w-max mb-2">
                  Próximo Curso Disponible
                </div>
                <h3 className="text-white font-bold font-['Manrope',sans-serif] text-lg leading-tight mb-1">
                  {recommendedClass.title}
                </h3>
                <div className="flex items-center gap-4 text-white/90 text-xs">
                  {recommendedClass.startsAtStr && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{recommendedClass.startsAtStr}</span>
                    </div>
                  )}
                  {recommendedClass.sessionTitle && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{recommendedClass.sessionTitle}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Agenda */}
        <div className="bg-white rounded-3xl p-4 md:p-8 border border-[#e9e8e7] shadow-sm lg:h-[calc(100vh-200px)] lg:overflow-y-auto">
          <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-6">
            Agenda del Mes
          </h2>
          
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-8 bottom-8 w-px bg-[#e9e8e7]" />

            <div className="space-y-4 md:space-y-8 relative">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#a3a3a3]">
                  <p className="text-[#5d5e60] text-sm">No hay eventos programados para este mes.</p>
                </div>
              ) : (
                events.map((event) => {
                // Determine icon and colors based on event type
                let IconComponent = CheckCircle2;
                let iconBg = 'bg-[#f5f3f2]';
                let iconColor = 'text-[#5d5e60]';
                
                if (event.type === 'upcoming') {
                  IconComponent = School;
                  iconBg = 'bg-[#dc2626]';
                  iconColor = 'text-white';
                } else if (event.type === 'future') {
                  IconComponent = Clock;
                  iconBg = 'bg-[#f5f3f2]';
                  iconColor = 'text-[#5d5e60]';
                } else if (event.type === 'evaluation') {
                  IconComponent = FileText;
                  iconBg = 'bg-[#8c6b63]'; // A brown/dark tone from Figma for eval
                  iconColor = 'text-white';
                }

                return (
                  <div key={event.id} className="flex gap-4 relative z-10">
                    <div className={clsx("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm", iconBg)}>
                      <IconComponent className={clsx("w-4 h-4", iconColor)} />
                    </div>
                    
                    <div className={clsx(
                      "flex-1 pb-4", 
                      event.type === 'upcoming' ? "bg-white border border-[#fca5a5] rounded-xl p-4 shadow-sm relative -top-3" : ""
                    )}>
                      <div className={clsx("text-[11px] font-bold tracking-wider uppercase mb-1", event.type === 'upcoming' ? "text-[#dc2626]" : "text-[#5d5e60]")}>
                        {event.fullDateStr}
                      </div>
                      <h3 className="text-[#1b1c1b] font-bold text-[15px] leading-tight mb-1">
                        {event.title}
                      </h3>
                      <p className="text-[#5d5e60] text-sm leading-relaxed mb-2">
                        {event.description}
                      </p>
                      
                      {event.tag && (
                        <div className={clsx(
                          "inline-block px-2 py-0.5 rounded text-[11px] font-bold",
                          event.tagType === 'grey' ? "bg-[#f5f3f2] text-[#5d5e60]" : "bg-red-100 text-[#dc2626]"
                        )}>
                          {event.tag}
                        </div>
                      )}

                      {event.extraInfo && (
                        <div className="mt-3 bg-[#f5f3f2] rounded-lg p-3 flex items-start gap-2">
                          <div className="w-4 h-4 mt-0.5 border border-[#a3a3a3] rounded-full flex items-center justify-center text-[10px] font-bold text-[#5d5e60] flex-shrink-0">
                            i
                          </div>
                          <span className="text-xs text-[#5d5e60] leading-snug">
                            {event.extraInfo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
