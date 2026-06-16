import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateStudentProfile } from '@/services/studentProfileService';
import { supabase } from '@/services/supabase';
import { costaRicaLocations, type Province } from "@/data/costaRicaLocations";

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function isValidIdentification(value: string) {
  return /^\d{9}$/.test(value);
}

function isValidPhone(value: string) {
  return /^\d{8}$/.test(value);
}

function isValidPassword(value: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value);
}

type Props = {
  user: any;
  profile: any;
  onSave: () => void;
};

export function CompleteProfileModal({ user, profile, onSave }: Props) {
  const isGoogleUser = user?.app_metadata?.provider === 'google';

  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    identification: profile.identification || '',
    phone: profile.phone || '',
    province: profile.province || '',
    canton: profile.canton || '',
    district: profile.district || '',
    exact_address: profile.exact_address || '',
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const provincesList = Object.keys(costaRicaLocations);
  const cantonsList = formData.province
    ? Object.keys(costaRicaLocations[formData.province as Province] || {})
    : [];
  const districtsList = formData.province && formData.canton
    ? costaRicaLocations[formData.province as Province]?.[
        formData.canton as keyof (typeof costaRicaLocations)[Province]
      ] ?? []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.full_name.trim() || !formData.identification.trim() || !formData.phone.trim() || !formData.province || !formData.canton || !formData.district || !formData.exact_address.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!isValidIdentification(formData.identification)) {
      setError('La cédula debe contener exactamente 9 dígitos numéricos.');
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError('El teléfono debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    if (isGoogleUser) {
      if (!password) {
        setError('Debes establecer una contraseña.');
        return;
      }
      if (!isValidPassword(password)) {
        setError('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isGoogleUser && password) {
        const { error: pwdError } = await supabase.auth.updateUser({ password });
        if (pwdError) throw pwdError;
      }

      await updateStudentProfile(profile.id, {
        full_name: formData.full_name,
        identification: formData.identification,
        phone: formData.phone,
        province: formData.province,
        canton: formData.canton,
        district: formData.district,
        exact_address: formData.exact_address,
      });

      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al guardar los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        <div className="p-8 border-b border-[#e9e8e7] bg-red-50/30">
          <h2 className="text-2xl font-extrabold font-['Manrope',sans-serif] text-zinc-900">
            ¡Bienvenido! Completa tu perfil
          </h2>
          <p className="mt-2 text-sm text-zinc-600 font-medium">
            Para poder continuar usando la plataforma, necesitamos que completes tus datos personales y establezcas una contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-medium rounded-2xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-zinc-900 font-['Manrope',sans-serif]">Información Personal</h3>
            
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Cédula <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.identification}
                  onChange={e => setFormData({...formData, identification: onlyNumbers(e.target.value).slice(0, 9)})}
                  placeholder="9 dígitos"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Teléfono <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: onlyNumbers(e.target.value).slice(0, 8)})}
                  placeholder="8 dígitos"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-lg text-zinc-900 font-['Manrope',sans-serif]">Dirección</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Provincia <span className="text-red-500">*</span></label>
                <select 
                  value={formData.province}
                  onChange={e => setFormData({...formData, province: e.target.value, canton: '', district: ''})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600 bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {provincesList.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Cantón <span className="text-red-500">*</span></label>
                <select 
                  value={formData.canton}
                  onChange={e => setFormData({...formData, canton: e.target.value, district: ''})}
                  disabled={!formData.province}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600 bg-white disabled:bg-gray-50"
                >
                  <option value="">Seleccionar...</option>
                  {cantonsList.map(can => (
                    <option key={can} value={can}>{can}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Distrito <span className="text-red-500">*</span></label>
                <select 
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  disabled={!formData.canton}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600 bg-white disabled:bg-gray-50"
                >
                  <option value="">Seleccionar...</option>
                  {districtsList.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">Dirección Exacta <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.exact_address}
                onChange={e => setFormData({...formData, exact_address: e.target.value})}
                placeholder="Señas exactas, casa, apartamento..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600"
              />
            </div>
          </div>

          {isGoogleUser && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-bold text-lg text-zinc-900 font-['Manrope',sans-serif]">Establecer Contraseña</h3>
              <p className="text-xs text-zinc-500 mb-2">Crea una contraseña para poder iniciar sesión directamente en el futuro sin depender de Google.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1.5">Contraseña <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1.5">Confirmar Contraseña <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-600"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLoading ? 'Guardando...' : 'Guardar y Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
