import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/SpeUC9WfjuCUsVg2A"

const CONTACT_IMAGE =
  "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1200&auto=format&fit=crop"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const subject = encodeURIComponent("Consulta desde el sitio web G&G")
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\nCorreo: ${formData.email}\nTeléfono: ${formData.phone}\n\nMensaje:\n${formData.message}`
    )

    window.location.href = `mailto:centrodecapacitaciongyg@gmail.com?subject=${subject}&body=${body}`
  }

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
              ¿Tienes dudas sobre nuestros cursos o pagos? Nuestro equipo está
              listo para atenderte en el Centro de Capacitación G&G.
            </p>
          </div>

          <div className="min-h-80 overflow-hidden rounded-2xl shadow-xl">
            <img
              src={CONTACT_IMAGE}
              alt="Repostería profesional"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-8 py-16 lg:grid-cols-[2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold text-zinc-900">
            <Mail className="text-red-600" />
            Envíanos un mensaje
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Nombre Completo"
              name="name"
              placeholder="Ej. Ana García"
              value={formData.name}
              onChange={handleChange}
            />

            <Field
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="ana@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6">
            <Field
              label="Teléfono"
              name="phone"
              placeholder="+506 0000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-zinc-600">
              Mensaje
            </label>

            <textarea
              required
              name="message"
              value={formData.message}
              onChange={handleChange}
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
            <h3 className="text-xl font-bold text-white">Atención Directa</h3>

            <div className="mt-6 space-y-6">
              <ContactItem
                icon={<Phone className="h-5 w-5" />}
                label="WhatsApp / Celular"
                value="8509-3777"
              />

              <ContactItem
                icon={<Phone className="h-5 w-5" />}
                label="Oficina Central"
                value="2278-1657"
              />
            </div>

            <div className="mt-8 border-t border-white/20 pt-6">
              <p className="text-sm text-white/80">
                Síguenos en redes sociales
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <SocialItem
                  name="Facebook"
                  icon="/facebook.svg"
                  href="https://www.facebook.com/centrodecapacitaciongyg"
                />

                <SocialItem
                  name="Instagram"
                  icon="/instagram.svg"
                  href="https://www.instagram.com/centrodecapacitaciongyg/"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-stone-200 p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-900">
              <MapPin className="h-5 w-5 text-red-600" />
              Nuestra Ubicación
            </h3>

            <p className="mt-3 text-sm leading-5 text-zinc-600">
              Estamos ubicados en Tres Ríos, Cartago, Costa Rica.
            </p>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
            >
              <MapPin className="h-4 w-4" />
              Ver en Google Maps
            </a>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="rounded-2xl bg-stone-200 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-zinc-900">
            ¿Listo para transformar tu pasión?
          </h2>

          <p className="mt-4 text-zinc-600">
            Nuestros cupos se llenan rápido. Contáctanos hoy mismo para asegurar
            tu espacio en los cursos.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button asChild className="bg-zinc-900 hover:bg-zinc-800">
              <Link to="/courses">Ver Cursos</Link>
            </Button>

            <Button asChild className="bg-[#25D366] hover:bg-[#22bf5b]">
              <a
                href="https://wa.me/50685093777"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Directo
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function Field({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string
  name: string
  placeholder: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-zinc-600">{label}</label>

      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg border border-red-200 bg-stone-50 px-3 py-3.5 text-base outline-none focus:border-red-500"
        placeholder={placeholder}
      />
    </div>
  )
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
        {icon}
      </div>

      <div>
        <p className="text-sm text-white/80">{label}</p>
        <p className="text-lg font-semibold tracking-wide text-white">{value}</p>
      </div>
    </div>
  )
}

function SocialItem({
  name,
  icon,
  href,
}: {
  name: string
  icon: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-lg bg-white/10 p-3 font-semibold text-white transition hover:bg-white/20"
    >
      <img src={icon} alt={name} className="h-5 w-5" />
      {name}
    </a>
  )
}