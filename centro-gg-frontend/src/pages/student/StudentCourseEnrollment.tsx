import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getPublishedCourseById } from '@/services/courseService';
import { submitStudentEnrollment } from '@/services/studentEnrollmentService';
import { useAuth } from '@/providers/auth/useAuth';

export default function StudentCourseEnrollment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'sinpe' | 'bank_transfer'>('sinpe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['published-course', courseId],
    queryFn: () => getPublishedCourseById(courseId!),
    enabled: Boolean(courseId),
  });

  // Example of form persistence (using sessionStorage for notes/phone etc. if needed)
  // For this form, since it's just a file upload, we can't persist the file itself securely across hard reloads,
  // but we provide a robust file selector.

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      
      if (!validTypes.includes(file.type)) {
        setSubmitError("Formato de archivo inválido. Sube un PDF o imagen (JPG/PNG).");
        return;
      }
      
      // Limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("El archivo es demasiado grande. El límite es 5MB.");
        return;
      }

      setSubmitError(null);
      setReceiptFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile || !course || !user) {
      setSubmitError("Debes adjuntar el comprobante de pago para continuar.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitStudentEnrollment({
        courseId: course.id,
        studentId: user.id, // Using the auth.users id. The service will map to profiles. Wait, the service uses `studentId` as `profiles.id` but `auth.users.id` and `profiles.id` are the same.
        price: course.price || 0,
        courseTitle: course.title,
        receiptFile: receiptFile,
        method: paymentMethod,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/student/payments');
      }, 3000);
    } catch (error: any) {
      console.error(error);
      setSubmitError(error.message || "Error al procesar la inscripción. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-[#dc2626] animate-spin" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500 font-bold">
        Error al cargar la información del curso.
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 text-center mt-12 bg-white rounded-3xl shadow-sm border border-[#e9e8e7]">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] mb-4">
          ¡Inscripción Enviada!
        </h2>
        <p className="text-[#5d5e60] mb-8">
          Tu comprobante de pago ha sido recibido y tu inscripción está en estado <strong>Pendiente de revisión</strong>. Un administrador validará tu pago pronto.
        </p>
        <p className="text-sm text-gray-400">Redirigiendo a tus pagos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-['Inter',sans-serif]">
      <div className="mb-6">
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#dc2626] hover:text-[#b91c1c] transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a detalles del curso
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-4 md:p-8 md:p-12 shadow-sm border border-[#e9e8e7]">
        <h1 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] mb-2">
          Finaliza tu Matrícula
        </h1>
        <p className="text-[#5d5e60] mb-8">
          Adjunta tu comprobante de pago (transferencia o depósito) para el siguiente curso.
        </p>

        {/* Course Info Card */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1b1c1b] mb-3">{course.title}</h2>
          <p className="text-sm text-red-800 leading-relaxed max-w-3xl mb-6">
            {course.description || "Sin descripción adicional."}
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-6 border-t border-red-200">
            <div>
              <p className="text-sm text-red-900/70 font-medium mb-1">Monto a pagar</p>
              <p className="text-3xl font-bold text-[#dc2626]">
                ₡{(course.price || 0).toLocaleString()} <span className="text-base text-red-900/60 font-medium">CRC</span>
              </p>
            </div>
            <div className="text-left md:text-right bg-white/60 p-4 rounded-xl border border-red-100/50">
              <p className="text-xs text-red-900/60 font-bold uppercase tracking-wider mb-2">Cuentas Bancarias Autorizadas</p>
              <p className="text-[15px] text-[#1b1c1b] font-bold mb-1">IBAN: CR79015107510010095525</p>
              <p className="text-[15px] text-[#1b1c1b] font-bold">SINPE Móvil: 8509-3777 Maria Eugenia Guillén</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
          <div>
            <label className="block text-sm font-bold text-[#1b1c1b] mb-2">
              Método de Pago
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'sinpe' | 'bank_transfer')}
              className="w-full md:w-1/2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
            >
              <option value="sinpe">SINPE Móvil</option>
              <option value="bank_transfer">Transferencia Bancaria</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1b1c1b] mb-4">
              Comprobante de Pago
            </label>
            <div 
              className="border-2 border-dashed border-[#a3a3a3] rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
              
              {receiptFile ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-[#dc2626]">
                    <FileText size={32} />
                  </div>
                  <p className="font-bold text-[#1b1c1b] mb-1">{receiptFile.name}</p>
                  <p className="text-sm text-[#5d5e60]">
                    {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-[#dc2626] font-bold mt-4 hover:underline">
                    Clic para cambiar archivo
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Upload size={32} />
                  </div>
                  <p className="font-bold text-[#1b1c1b] mb-2">Haz clic para subir tu comprobante</p>
                  <p className="text-sm text-[#5d5e60]">Soporta PDF, PNG, JPG (Max. 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{submitError}</p>
            </div>
          )}

          <div className="pt-4 border-t border-[#e9e8e7] flex justify-end">
            <button
              type="submit"
              disabled={!receiptFile || isSubmitting}
              className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 md:px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              Confirmar Inscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
