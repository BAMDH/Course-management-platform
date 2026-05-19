import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  FileText,
  School
} from 'lucide-react';
import clsx from 'clsx';

// Type definitions for the mocked data
type EventType = 'past' | 'upcoming' | 'future' | 'evaluation';

interface CalendarEvent {
  id: string;
  type: EventType;
  date: number; // Day of the month
  fullDateStr: string;
  title: string;
  description: string;
  tag: string;
  tagType: 'grey' | 'red';
  extraInfo?: string;
}

const EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    type: 'past',
    date: 2,
    fullDateStr: 'MAR 2, 9:00 AM',
    title: 'Masas Quebradas',
    description: 'Introducción a tartas y quiches.',
    tag: 'Asistió',
    tagType: 'grey'
  },
  {
    id: 'e2',
    type: 'upcoming',
    date: 9,
    fullDateStr: 'MAR 9, 9:00 AM',
    title: 'Bizcochos Ligeros',
    description: 'Genovesa y biscuit para pasteles en capas.',
    tag: '',
    tagType: 'grey',
    extraInfo: 'Traer batidor de globo personal'
  },
  {
    id: 'e3',
    type: 'future',
    date: 16,
    fullDateStr: 'MAR 16, 9:00 AM',
    title: 'Cremas Base',
    description: 'Crema pastelera, inglesa y chantilly.',
    tag: '',
    tagType: 'grey'
  },
  {
    id: 'e4',
    type: 'evaluation',
    date: 23,
    fullDateStr: 'MAR 23, 9:00 AM',
    title: 'Evaluación Práctica 1',
    description: 'Armado y decoración de pastel base.',
    tag: 'Obligatorio',
    tagType: 'grey'
  }
];

export default function StudentCalendar() {
  // Calendar configuration for Oct 2023 (Starts on Sunday)
  const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const startDayOffset = 0; // Oct 1, 2023 was a Sunday (index 0)
  const daysInMonth = 31;

  // Previous month trailing days
  const prevMonthDays = [24, 25, 26, 27, 28, 29, 30];

  const renderCalendarDay = (dayNum: number) => {
    // Determine the state of this specific day
    const isPastEvent = dayNum === 2;
    const isUpcoming = dayNum === 9;
    const isFutureEvent1 = dayNum === 16;
    const isEvalEvent = dayNum === 23;
    const isFutureEvent2 = dayNum === 30;

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
    } else if (isFutureEvent1 || isFutureEvent2) {
      baseClasses += "border border-[#dc2626] ";
      textClasses += "text-[#dc2626] font-bold ";
      iconOrDot = <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] mt-1" />;
    } else if (isEvalEvent) {
      baseClasses += "border border-[#e9e8e7] bg-white ";
      iconOrDot = <CheckCircle2 className="w-4 h-4 text-[#5d5e60] mt-1" />;
    } else {
      baseClasses += "hover:bg-slate-50 ";
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
    <div className="p-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b]">
            Calendario de Clases
          </h1>
          <p className="text-[#5d5e60] text-sm mt-1">
            Centro De Capacitación G&G - Octubre 2023
          </p>
        </div>
        <div className="bg-[#f5f3f2] px-4 py-2 rounded-full text-sm font-medium text-[#5d5e60]">
          Grupo: Martes 9am-12pm
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar & Banner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm">
            {/* Month Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                Octubre
              </h2>
              <div className="flex gap-2">
                <button className="p-1.5 text-[#5d5e60] hover:bg-[#f5f3f2] rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-1.5 text-[#5d5e60] hover:bg-[#f5f3f2] rounded-lg transition-colors">
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
          <div className="relative overflow-hidden rounded-3xl h-[160px] shadow-sm group cursor-pointer">
            <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/30 transition-colors" />
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200" 
              alt="Taller de panadería"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
              <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-md text-[10px] font-bold text-white tracking-wider mb-2">
                TALLER ESPECIAL
              </div>
              <h3 className="text-white font-bold text-lg font-['Manrope',sans-serif]">
                Técnicas de Decoración Avanzada
              </h3>
              <p className="text-white/80 text-sm mt-0.5">
                Inscríbete ahora para la sesión extra de este viernes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Agenda */}
        <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm lg:h-[calc(100vh-200px)] lg:overflow-y-auto">
          <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-6">
            Agenda del Mes
          </h2>
          
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-8 bottom-8 w-px bg-[#e9e8e7]" />

            <div className="space-y-8 relative">
              {EVENTS.map((event) => {
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
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
