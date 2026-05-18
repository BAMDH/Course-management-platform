import { Button } from "@/components/ui/button"

interface TermsModalProps {
  onAccept: () => void
}

export function TermsModal({ onAccept }: TermsModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 p-6 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-red-200/50 bg-white shadow-2xl">
        <div className="border-b border-neutral-200 bg-stone-100/70 p-6">
          <h2 className="text-2xl font-bold text-zinc-900">
            Términos y Condiciones de Uso
          </h2>
        </div>

        <div className="space-y-5 overflow-y-auto p-6 text-base leading-6 text-stone-700">
          <p>
            Bienvenido al Centro de Capacitación G&G. Al acceder y utilizar nuestra
            plataforma de cursos culinarios y servicios asociados, usted acepta estar
            sujeto a los siguientes términos y condiciones.
          </p>

          <section>
            <h3 className="mb-2 text-lg font-bold text-zinc-900">
              1. Uso de la Plataforma y Contenido
            </h3>
            <p>
              Todo el material didáctico, videos, recetas, manuales y recursos
              proporcionados son propiedad exclusiva del Centro de Capacitación G&G
              o de sus respectivos licenciantes.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-bold text-zinc-900">
              2. Política de Privacidad y Manejo de Datos
            </h3>
            <p>
              Recopilamos información necesaria para la gestión de su inscripción,
              seguimiento académico y emisión de certificados.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Los datos se utilizarán para fines educativos y administrativos.</li>
              <li>No compartiremos su información personal sin consentimiento.</li>
              <li>Implementamos medidas de seguridad para proteger sus datos.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-bold text-zinc-900">
              3. Cancelaciones y Reembolsos
            </h3>
            <p>
              Las solicitudes de cancelación deben realizarse con al menos 7 días
              hábiles de anticipación para ser elegibles a reembolso.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-bold text-zinc-900">
              4. Código de Conducta
            </h3>
            <p>
              Esperamos que todos los estudiantes mantengan un ambiente de respeto
              mutuo tanto en clases presenciales como virtuales.
            </p>
          </section>

          <p className="text-xs text-stone-700/70">
            Última actualización: 15 de noviembre de 2024
          </p>
        </div>

        <div className="flex justify-end border-t border-neutral-200 bg-stone-100 p-6">
          <Button onClick={onAccept} className="bg-red-600 px-8 hover:bg-red-700">
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}