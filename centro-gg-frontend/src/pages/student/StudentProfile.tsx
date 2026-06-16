import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/providers/auth/useAuth';
import { 
  Pencil, 
  MapPin, 
  Mail, 
  CreditCard, 
  CalendarDays, 
  GraduationCap, 
  Settings, 
  Camera, 
  Loader2,
  Award,
  Download,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStudentProfileData, 
  updateStudentProfile, 
  uploadAvatar, 
  updateStudentPassword,
  resetStudentPassword,
  type ProfileUpdatePayload
} from '@/services/studentProfileService';
import { costaRicaLocations, type Province } from "@/data/costaRicaLocations";

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "")
}

function isValidIdentification(value: string) {
  return /^\d{9}$/.test(value)
}

function isValidPhone(value: string) {
  return /^\d{8}$/.test(value)
}

function isValidPassword(value: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value)
}

const StudentProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdatePayload>({});
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const provincesList = Object.keys(costaRicaLocations);

  const cantonsList = formData.provincia
    ? Object.keys(costaRicaLocations[formData.provincia as Province] || {})
    : [];

  const districtsList =
    formData.provincia && formData.canton
      ? costaRicaLocations[formData.provincia as Province]?.[
          formData.canton as keyof (typeof costaRicaLocations)[Province]
        ] ?? []
      : [];

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['studentProfile', user?.email],
    queryFn: () => getStudentProfileData(user?.email || 'estudiante@prueba.com'),
    enabled: !!user?.email,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: ProfileUpdatePayload) => updateStudentProfile(profile?.id || '', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      setIsEditing(false);
    }
  });

  // Populate form when entering edit mode or when profile data changes
  useEffect(() => {
    if (profile && isEditing) {
      setFormData({
        full_name: profile.full_name,
        phone: profile.phone,
        cedula: profile.cedula,
        provincia: profile.provincia,
        canton: profile.canton,
        distrito: profile.distrito,
        direccion_exacta: profile.direccion_exacta,
        date_of_birth: profile.date_of_birth,
        avatar_url: profile.avatar_url,
        email_notifications: profile.email_notifications,
      });
      setPasswordData({ current: '', new: '', confirm: '' });
      setPasswordError('');
      setFormError('');
    }
  }, [profile, isEditing]);

  // Force edit mode if essential info is missing
  useEffect(() => {
    if (profile && !isEditing) {
      if (!profile.full_name || !profile.phone || !profile.cedula) {
        setIsEditing(true);
        setFormError('Por favor completa tu información personal obligatoria.');
      }
    }
  }, [profile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    try {
      setIsUploading(true);
      const url = await uploadAvatar(file, profile.id);
      setFormData(prev => ({ ...prev, avatar_url: url }));
    } catch (err) {
      console.error("Failed to upload avatar", err);
      alert("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setFormError('');
    // Validation
    if (!formData.full_name?.trim() || !formData.phone?.trim() || !formData.cedula?.trim()) {
      setFormError('Nombre Completo, Teléfono y Cédula son obligatorios.');
      return;
    }

    if (!isValidIdentification(formData.cedula || '')) {
      setFormError('La cédula debe contener exactamente 9 dígitos numéricos.');
      return;
    }

    if (!isValidPhone(formData.phone || '')) {
      setFormError('El teléfono debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    if (passwordData.new) {
      if (!isValidPassword(passwordData.new)) {
        setPasswordError('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
        return;
      }
      if (passwordData.new !== passwordData.confirm) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }
      try {
        await updateStudentPassword(passwordData.new);
      } catch (err: any) {
        setPasswordError(err.message || 'Error al actualizar contraseña');
        return;
      }
    }
    
    updateMutation.mutate(formData);
  };

  const handleResetPassword = async () => {
    if (!profile?.email) return;
    try {
      await resetStudentPassword(profile.email);
      setResetMessage('Se ha enviado un enlace de restablecimiento a tu correo electrónico.');
    } catch (err: any) {
      setResetMessage('Error al enviar enlace de restablecimiento.');
    }
  };

  const handleToggleNotifications = () => {
    if (profile) {
      updateMutation.mutate({ email_notifications: !profile.email_notifications });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-red-500">
        Error cargando el perfil: {error ? error.toString() : 'Perfil no encontrado'}
      </div>
    );
  }

  const avatarDisplay = formData.avatar_url || profile.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200';

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b]">
            {isEditing ? 'Editar Perfil' : 'Mi Perfil'}
          </h1>
          <p className="text-[#5d5e60] text-sm mt-1">
            {isEditing 
              ? 'Actualiza tu información para mantener tu cuenta al día en Centro De Capacitación G&G.'
              : 'Centro De Capacitación G&G - Estudiante'}
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-[#dc2626] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
          >
            <Pencil className="w-4 h-4" />
            Editar Perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e9e8e7] relative">
            <div className="h-28 bg-[#fdf2f2] w-full" />
            
            <div className="flex flex-col items-center -mt-14 pb-6 px-6 relative">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                  {isUploading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Loader2 className="w-6 h-6 animate-spin text-[#dc2626]" />
                    </div>
                  ) : (
                    <img src={avatarDisplay} alt="Profile" className="w-full h-full object-cover" />
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[#dc2626] text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <h2 className="text-xl font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mt-4 text-center">
                {profile.full_name || 'Estudiante'}
              </h2>
              {profile.level && (
                <span className="text-[#5d5e60] text-xs font-medium mt-1 text-center">
                  {profile.level}
                </span>
              )}
            </div>

            {!isEditing && (
              <div className="border-t border-[#e9e8e7] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider">Cédula</div>
                    <div className="text-sm text-[#1b1c1b] font-medium mt-0.5">{profile.cedula || 'No especificada'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider">Correo Electrónico</div>
                    <div className="text-sm text-[#1b1c1b] font-medium mt-0.5 break-all">{profile.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider">Dirección</div>
                    <div className="text-sm text-[#1b1c1b] font-medium mt-0.5">
                      {profile.provincia || profile.canton 
                        ? `${profile.provincia}, ${profile.canton}, ${profile.distrito}` 
                        : 'No especificada'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-4 h-4 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider">Fecha de Ingreso</div>
                    <div className="text-sm text-[#1b1c1b] font-medium mt-0.5">
                      {new Date(profile.created_at).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                {profile.date_of_birth && (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-[#dc2626] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider">Fecha de Nacimiento</div>
                      <div className="text-sm text-[#1b1c1b] font-medium mt-0.5">
                        {new Date(profile.date_of_birth).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {!isEditing ? (
            // ================= VIEW MODE =================
            <>
              {/* Estado Académico */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                  <GraduationCap className="w-5 h-5 text-[#dc2626]" />
                  Estado Académico
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Curso Actual */}
                  <div className="bg-[#fdf2f2] rounded-2xl p-5 border border-red-100 relative overflow-hidden">
                    <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider mb-2">Curso Actual</div>
                    <h4 className="font-bold text-[#1b1c1b] text-base z-10 relative pr-4">
                      {profile.ongoingCourse?.title || 'Sin curso activo'}
                    </h4>
                    {profile.ongoingCourse && (
                      <div className="flex items-center gap-1.5 text-xs text-[#5d5e60] mt-3 z-10 relative">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {profile.ongoingCourse.schedule}
                      </div>
                    )}
                    <GraduationCap className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-40 transform -rotate-12 z-0" />
                  </div>
                  
                  {/* Asistencia General */}
                  <div className="bg-[#fdf2f2] rounded-2xl p-5 border border-red-100 flex flex-col items-center justify-center relative">
                    <div className="text-[10px] font-bold text-[#5d5e60] uppercase tracking-wider mb-3 w-full text-left absolute top-5 left-5">
                      Asistencia General
                    </div>
                    <div className="relative w-20 h-20 mt-4 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-200 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-[#dc2626] stroke-current" strokeDasharray={`${profile.generalAttendance}, 100`} strokeWidth="3" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute font-bold text-lg text-[#1b1c1b]">{profile.generalAttendance}%</div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-3 py-1 rounded-full mt-3">
                      {profile.attendanceStatus}
                    </div>
                  </div>
                </div>

                {/* Módulos Recientes */}
                <div className="bg-white rounded-2xl border border-[#e9e8e7] overflow-hidden">
                  <div className="p-4 bg-gray-50 text-xs font-bold text-[#5d5e60] uppercase tracking-wider border-b border-[#e9e8e7]">
                    Módulos Recientes
                  </div>
                  <div className="divide-y divide-[#e9e8e7]">
                    {profile.recentModules.length > 0 ? profile.recentModules.map(mod => (
                      <div key={mod.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-4 h-4 text-[#dc2626]" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#1b1c1b]">{mod.title}</div>
                            <div className="text-xs text-[#5d5e60]">Finalizado recientemente</div>
                          </div>
                        </div>
                        <div className="bg-gray-100 px-3 py-1 rounded-md text-xs font-bold text-[#1b1c1b]">
                          {mod.grade}/100
                        </div>
                      </div>
                    )) : (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        No hay módulos recientes.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Certificaciones Obtenidas */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="flex items-center gap-2 text-lg font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                    <Award className="w-5 h-5 text-[#dc2626]" />
                    Certificaciones Obtenidas
                  </h3>
                  {profile.certifications.length > 0 && (
                    <button 
                      onClick={() => setIsCertModalOpen(true)}
                      className="text-sm font-bold text-[#dc2626] hover:underline"
                    >
                      Ver todas
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certifications.length > 0 ? profile.certifications.map(cert => (
                    <div key={cert.id} className="bg-white border border-[#e9e8e7] rounded-2xl p-5 flex gap-4 items-start shadow-sm hover:border-red-200 transition-colors">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-[#1b1c1b] leading-tight mb-1">{cert.title}</h4>
                        <div className="text-xs text-[#5d5e60] mb-3">Emitido: {cert.date}</div>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[#dc2626] hover:text-red-700 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          Descargar PDF
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-1 md:col-span-2 p-6 text-center bg-white border border-[#e9e8e7] rounded-2xl shadow-sm text-gray-500 text-sm">
                      Aún no has obtenido certificaciones. ¡Sigue aprendiendo!
                    </div>
                  )}
                </div>
              </section>

              {/* Configuración de Cuenta */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-bold font-['Manrope',sans-serif] text-[#1b1c1b]">
                  <Settings className="w-5 h-5 text-gray-500" />
                  Configuración de Cuenta
                </h3>
                
                <div className="bg-white rounded-2xl border border-[#e9e8e7] overflow-hidden divide-y divide-[#e9e8e7]">
                  <div className="p-5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-[#1b1c1b]">Notificaciones por Correo</div>
                      <div className="text-xs text-[#5d5e60]">Recibir actualizaciones de cursos y horarios.</div>
                    </div>
                    {/* Real Toggle */}
                    <button 
                      onClick={handleToggleNotifications}
                      className={`w-11 h-6 rounded-full relative transition-colors ${profile.email_notifications ? 'bg-[#dc2626]' : 'bg-gray-300'}`}
                      aria-label="Toggle notifications"
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${profile.email_notifications ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-[#1b1c1b]">Contraseña</div>
                      <div className="text-xs text-[#5d5e60]">Puedes actualizar tu contraseña en el modo de edición.</div>
                    </div>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold px-4 py-2 border border-[#e9e8e7] rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </section>
            </>
          ) : (
            // ================= EDIT MODE =================
            <div className="space-y-6">
              
              {formError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
                  {formError}
                </div>
              )}

              {/* Información Personal */}
              <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-6">
                  Información Personal
                </h3>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.full_name || ''}
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Cédula <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.cedula || ''}
                        onChange={e => setFormData({...formData, cedula: onlyNumbers(e.target.value).slice(0, 9)})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Correo Electrónico</label>
                      <input 
                        type="email" 
                        value={profile.email}
                        disabled
                        className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Teléfono <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        value={formData.phone || ''}
                        onChange={e => setFormData({...formData, phone: onlyNumbers(e.target.value).slice(0, 8)})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Fecha de Nacimiento</label>
                      <input 
                        type="date" 
                        value={formData.date_of_birth || ''}
                        onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-[#1b1c1b] mb-3">Dirección</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Provincia</label>
                        <select 
                          value={formData.provincia || ''}
                          onChange={e => setFormData({...formData, provincia: e.target.value, canton: '', distrito: ''})}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626] bg-white"
                        >
                          <option value="">Seleccionar...</option>
                          {provincesList.map(prov => (
                            <option key={prov} value={prov}>{prov}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Cantón</label>
                        <select 
                          value={formData.canton || ''}
                          onChange={e => setFormData({...formData, canton: e.target.value, distrito: ''})}
                          disabled={!formData.provincia}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          <option value="">Seleccionar...</option>
                          {cantonsList.map(can => (
                            <option key={can} value={can}>{can}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Distrito</label>
                        <select 
                          value={formData.distrito || ''}
                          onChange={e => setFormData({...formData, distrito: e.target.value})}
                          disabled={!formData.canton}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626] bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          <option value="">Seleccionar...</option>
                          {districtsList.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dirección Exacta</label>
                      <input 
                        type="text" 
                        value={formData.direccion_exacta || ''}
                        onChange={e => setFormData({...formData, direccion_exacta: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="bg-white rounded-3xl p-8 border border-[#e9e8e7] shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold font-['Manrope',sans-serif] text-[#1b1c1b] mb-6">
                  Seguridad
                </h3>
                
                <div className="space-y-5">
                  {passwordError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                      {passwordError}
                    </div>
                  )}
                  {resetMessage && (
                    <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100">
                      {resetMessage}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Contraseña Actual</label>
                    <input 
                      type="password" 
                      value={passwordData.current}
                      onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        value={passwordData.new}
                        onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1b1c1b] mb-1.5">Confirmar Contraseña</label>
                      <input 
                        type="password" 
                        value={passwordData.confirm}
                        onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626]"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-start">
                    <button 
                      type="button"
                      onClick={handleResetPassword}
                      className="text-xs font-bold text-[#dc2626] hover:text-red-700 hover:underline transition-colors"
                    >
                      Olvidé mi contraseña, enviar enlace de restablecimiento
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-sm text-[#1b1c1b] border border-[#e9e8e7] hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2 bg-[#dc2626] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Guardar Cambios
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Certifications Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#e9e8e7] flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold font-['Manrope',sans-serif] flex items-center gap-2">
                <Award className="w-6 h-6 text-[#dc2626]" />
                Mis Certificaciones
              </h2>
              <button 
                onClick={() => setIsCertModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-4">
                {profile.certifications.map(cert => (
                  <div key={cert.id} className="bg-white border border-[#e9e8e7] rounded-2xl p-5 flex gap-4 items-start shadow-sm hover:border-red-200 transition-colors">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-[#1b1c1b] leading-tight mb-1">{cert.title}</h4>
                      <div className="text-xs text-[#5d5e60] mb-3">Emitido: {cert.date}</div>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-[#dc2626] hover:text-red-700 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Descargar PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-[#e9e8e7] bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsCertModalOpen(false)}
                className="px-6 py-2.5 rounded-full font-bold text-sm text-[#1b1c1b] border border-[#e9e8e7] hover:bg-gray-100 transition-colors bg-white shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
