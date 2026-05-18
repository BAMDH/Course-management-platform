import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F8]">
      <section className="bg-stone-100 px-8 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-red-600">
              Hablemos
            </span>

            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-zinc-900 md:text-6xl">
              Estamos aquí para <br />
              <span className="text-red-700">ayudarte a crecer.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-7 text-zinc-600">
              ¿Tienes dudas sobre nuestros cursos o pagos? Nuestro equipo está listo
              para atenderte en el Centro de Capacitación G&G.
            </p>
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-200 to-stone-50 shadow-xl">
            <span className="text-8xl">👨‍🍳</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-8 py-16 lg:grid-cols-[2fr_1fr]">
        <form className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-3xl font-bold text-zinc-900">
            Envíanos un mensaje
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Nombre Completo" placeholder="Ej. Ana García" />
            <Field label="Correo Electrónico" placeholder="ana@ejemplo.com" />
          </div>

          <div className="mt-6">
            <Field label="Teléfono" placeholder="+506 0000-0000" />
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-zinc-600">Mensaje</label>
            <textarea
              className="mt-2 min-h-36 w-full rounded-lg border border-red-200 bg-stone-50 px-3 py-3 text-base outline-none focus:border-red-500"
              placeholder="¿En qué curso estás interesado/a?"
            />
          </div>

          <Button className="mt-8 bg-red-600 px-8 py-6 font-bold hover:bg-red-700">
            Enviar Consulta
          </Button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-red-600 p-8 text-white shadow-lg">
            <h3 className="text-xl font-bold">Atención Directa</h3>

            <div className="mt-6 space-y-6">
              <ContactItem label="WhatsApp / Celular" value="8509-3777" />
              <ContactItem label="Oficina Central" value="2278-1657" />
            </div>

            <div className="mt-8 border-t border-white/20 pt-6">
              <p className="text-sm text-white/80">Síguenos en redes sociales</p>

              <div className="mt-4 space-y-3">
                <SocialItem name="Facebook" />
                <SocialItem name="Instagram" />
                <SocialItem name="YouTube" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-stone-200 p-8">
            <h3 className="text-xl font-bold text-zinc-900">Nuestra Ubicación</h3>
            <p className="mt-3 text-sm leading-5 text-zinc-600">
              Estamos ubicados en Tres Ríos, Cartago, Costa Rica.
            </p>

            <div className="mt-5 flex h-64 items-center justify-center rounded-xl border border-red-200 bg-zinc-900 text-white">
              Mapa temporal
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="rounded-2xl bg-stone-200 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-zinc-900">
            ¿Listo para transformar tu pasión?
          </h2>
          <p className="mt-4 text-zinc-600">
            Nuestros cupos se llenan rápido. Contáctanos hoy mismo para asegurar tu espacio en los cursos.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button asChild className="bg-zinc-900 hover:bg-zinc-800">
              <Link to="/courses">Ver Cursos</Link>
            </Button>

            <Button asChild className="bg-[#25D366] hover:bg-[#22bf5b]">
              <a href="https://wa.me/50685093777" target="_blank" rel="noreferrer">
                WhatsApp Directo
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-zinc-600">{label}</label>
      <input
        className="mt-2 w-full rounded-lg border border-red-200 bg-stone-50 px-3 py-3.5 text-base outline-none focus:border-red-500"
        placeholder={placeholder}
      />
    </div>
  )
}

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-white/80">{label}</p>
      <p className="text-lg font-semibold tracking-wide">{value}</p>
    </div>
  )
}

function SocialItem({ name }: { name: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-3 font-semibold">
      {name}
    </div>
  )
}