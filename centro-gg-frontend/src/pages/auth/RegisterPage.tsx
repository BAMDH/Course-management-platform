import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TermsModal } from "@/components/auth/TermsModal"
import { supabase } from "@/services/supabase"

export default function RegisterPage() {
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identification: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    province: "Cartago",
    canton: "",
    district: "",
    exactAddress: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.")
      return
    }

    setIsSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: formData.email,
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        identification: formData.identification,
        province: formData.province,
        canton: formData.canton,
        district: formData.district,
        exact_address: formData.exactAddress,
      })

      if (profileError) {
        setErrorMessage(profileError.message)
        setIsSubmitting(false)
        return
      }
    }

    navigate("/login")
  }

  return (
    <main className="min-h-screen bg-white px-8 py-16">
      <section className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative hidden overflow-hidden rounded-3xl shadow-2xl lg:block">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop"
            alt="Pastelería artesanal"
            className="h-full min-h-[560px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Inscripciones abiertas
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight">
              Centro de Capacitación <br /> G&G
            </h1>
            <p className="mt-3 text-base font-light text-stone-100/90">
              “Forjando el futuro de la pastelería artesanal con técnica y pasión.”
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-red-100/40 bg-white px-8 py-10 shadow-[0px_12px_40px_rgba(27,28,27,0.06)] md:px-12"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-zinc-900">
              Registro de Estudiante
            </h2>
            <p className="mt-2 text-base text-zinc-600">
              Complete la información para iniciar su proceso académico.
            </p>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <FormSection title="Datos personales">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nombre" placeholder="Juan" name="firstName" value={formData.firstName} onChange={handleChange} />
              <Field label="Apellidos" placeholder="Pérez" name="lastName" value={formData.lastName} onChange={handleChange} />
              <Field label="Identificación (ID)" placeholder="0-0000-0000" name="identification" value={formData.identification} onChange={handleChange} />
              <Field label="Número de Teléfono" placeholder="+506 0000-0000" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <Field label="Correo Electrónico" placeholder="ejemplo@correo.com" type="email" name="email" value={formData.email} onChange={handleChange} />
          </FormSection>

          <FormSection title="Credenciales de acceso">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Contraseña" placeholder="••••••••" type="password" name="password" value={formData.password} onChange={handleChange} />
              <Field label="Confirmar Contraseña" placeholder="••••••••" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </FormSection>

          <FormSection title="Ubicación">
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField label="Provincia" name="province" value={formData.province} onChange={handleChange} options={["Cartago"]} />
              <SelectField label="Cantón" name="canton" value={formData.canton} onChange={handleChange} options={["La Unión", "Cartago", "Paraíso"]} />
              <SelectField label="Distrito" name="district" value={formData.district} onChange={handleChange} options={["Tres Ríos", "San Diego", "San Juan"]} />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-600">
                Dirección Exacta
              </label>
              <textarea
                name="exactAddress"
                value={formData.exactAddress}
                onChange={handleChange}
                className="mt-2 min-h-24 w-full rounded-lg bg-stone-100 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Otras señas y detalles del domicilio..."
              />
            </div>

            <label className="flex items-start gap-2 text-sm font-medium text-zinc-600">
              <input type="checkbox" className="mt-0.5" required />
              <span>
                Al registrarte, aceptas nuestros{" "}
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(true)}
                  className="text-sky-700"
                >
                  términos y condiciones
                </button>
              </span>
            </label>
          </FormSection>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full rounded-3xl bg-red-600 py-7 text-lg font-bold hover:bg-red-700"
          >
            {isSubmitting ? "Registrando..." : "Registrarse →"}
          </Button>

          <p className="mt-6 text-center text-sm text-zinc-600">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login" className="font-semibold text-red-700">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </section>

      {isTermsOpen && <TermsModal onAccept={() => setIsTermsOpen(false)} />}
    </main>
  )
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10 space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-red-700">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  type?: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-600">{label}</label>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg bg-stone-100 px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-red-200"
        placeholder={placeholder}
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-600">{label}</label>
      <select
        required
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg bg-stone-100 px-4 py-3 text-base text-zinc-900 outline-none focus:ring-2 focus:ring-red-200"
      >
        <option value="">Seleccione...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}