import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { LandingNavbar } from "@/components/nav/LandingNavbar"
import { Button } from "@/components/ui/button"
import { TermsModal } from "@/components/auth/TermsModal"
import { costaRicaLocations, type Province } from "@/data/costaRicaLocations"
import { supabase } from "@/services/supabase"

const initialFormData = {
  firstName: "",
  lastName: "",
  identification: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  province: "",
  canton: "",
  district: "",
  exactAddress: "",
}

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

export default function RegisterPage() {
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()

  const provinces = Object.keys(costaRicaLocations)

  const cantons = formData.province
    ? Object.keys(costaRicaLocations[formData.province as Province])
    : []

  const districts =
    formData.province && formData.canton
      ? costaRicaLocations[formData.province as Province][
      formData.canton as keyof (typeof costaRicaLocations)[Province]
      ] ?? []
      : []

  const passwordsDoNotMatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target
    setErrorMessage("")

    setFormData((current) => {
      if (name === "identification") {
        return { ...current, identification: onlyNumbers(value).slice(0, 9) }
      }

      if (name === "phone") {
        return { ...current, phone: onlyNumbers(value).slice(0, 8) }
      }

      if (name === "province") {
        return { ...current, province: value, canton: "", district: "" }
      }

      if (name === "canton") {
        return { ...current, canton: value, district: "" }
      }

      return { ...current, [name]: value }
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    const normalizedEmail = formData.email.trim().toLowerCase()

    if (!isValidIdentification(formData.identification)) {
      setErrorMessage("La cédula debe contener exactamente 9 dígitos numéricos.")
      return
    }

    if (!isValidPhone(formData.phone)) {
      setErrorMessage("El teléfono debe contener exactamente 8 dígitos numéricos.")
      return
    }

    if (!isValidPassword(formData.password)) {
      setErrorMessage(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      )
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.")
      return
    }

    setIsSubmitting(true)

    const { data: emailExists, error: emailExistsError } = await supabase.rpc(
      "email_already_registered",
      {
        input_email: normalizedEmail,
      }
    )

    if (emailExistsError) {
      setErrorMessage("No se pudo validar el correo electrónico. Intentá nuevamente.")
      setIsSubmitting(false)
      return
    }

    if (emailExists) {
      setErrorMessage("Este correo electrónico ya se encuentra registrado.")
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          identification: formData.identification,
          phone: formData.phone,
          province: formData.province,
          canton: formData.canton,
          district: formData.district,
          exact_address: formData.exactAddress,
          level: "Principiante",
          email_notifications: true,
        },
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes("rate limit")) {
        setErrorMessage(
          "Se alcanzó el límite temporal de correos de confirmación. Intentá nuevamente en unos minutos."
        )
      } else {
        setErrorMessage(error.message)
      }

      setIsSubmitting(false)
      return
    }

    setFormData(initialFormData)
    setIsSubmitting(false)
    setIsSuccessModalOpen(true)
  }

  return (
    <>
      <LandingNavbar />

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

              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white">
                Centro de Capacitación <br /> G&G
              </h1>

              <p className="mt-3 text-base font-light text-stone-100/90">
                “Forjando el futuro de la pastelería artesanal con técnica y
                pasión.”
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
                Los campos marcados con <span className="text-red-600">*</span>{" "}
                son obligatorios.
              </p>
            </div>

            {errorMessage && (
              <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <FormSection title="Datos personales">
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Nombre *"
                  placeholder="Juan"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />

                <Field
                  label="Apellidos *"
                  placeholder="Pérez"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />

                <Field
                  label="Cédula *"
                  placeholder="123456789"
                  name="identification"
                  value={formData.identification}
                  onChange={handleChange}
                  helperText="Debe contener 9 dígitos numéricos."
                />

                <Field
                  label="Número de Teléfono *"
                  placeholder="88888888"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  helperText="Debe contener 8 dígitos numéricos."
                />
              </div>

              <Field
                label="Correo Electrónico *"
                placeholder="ejemplo@correo.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormSection>

            <FormSection title="Credenciales de acceso">
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Contraseña *"
                  placeholder="Mínimo 8 caracteres"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <Field
                  label="Confirmar Contraseña *"
                  placeholder="Repetí la contraseña"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  errorText={
                    passwordsDoNotMatch ? "Las contraseñas no coinciden." : ""
                  }
                />
              </div>

              <p className="text-sm text-zinc-500">
                La contraseña debe tener mínimo 8 caracteres, una mayúscula, una
                minúscula, un número y un carácter especial.
              </p>
            </FormSection>

            <FormSection title="Ubicación">
              <div className="grid gap-5 md:grid-cols-3">
                <SelectField
                  label="Provincia *"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  options={provinces}
                />

                <SelectField
                  label="Cantón *"
                  name="canton"
                  value={formData.canton}
                  onChange={handleChange}
                  options={cantons}
                  disabled={!formData.province}
                />

                <SelectField
                  label="Distrito *"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  options={[...districts]}
                  disabled={!formData.canton}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-600">
                  Dirección Exacta *
                </label>

                <textarea
                  required
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
                  .
                </span>
              </label>
            </FormSection>

            <Button
              type="submit"
              disabled={isSubmitting || passwordsDoNotMatch}
              className="mt-8 w-full rounded-3xl bg-red-600 py-7 text-lg font-bold hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Registrando..." : "Registrarse →"}
            </Button>

            <div className="relative flex items-center py-2 mt-4">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="mx-4 flex-shrink-0 text-sm text-zinc-400 font-medium">O</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <Button
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: { redirectTo: `${window.location.origin}/auth/callback` }
                })
                if (error) setErrorMessage("No se pudo registrar con Google.")
              }}
              className="mt-4 h-16 w-full rounded-3xl bg-white border-2 border-stone-200 text-lg font-bold text-zinc-700 hover:bg-stone-50 hover:text-zinc-900 transition flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Registrarse con Google
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

        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
              <h3 className="text-2xl font-bold text-zinc-900">
                Registro recibido
              </h3>

              <p className="mt-4 text-zinc-600">
                Te enviamos un correo de confirmación. Revisá tu bandeja de
                entrada y confirmá tu cuenta antes de iniciar sesión.
              </p>

              <Button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false)
                  navigate("/login")
                }}
                className="mt-6 w-full bg-red-600 hover:bg-red-700"
              >
                Entendido
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
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
  helperText,
  errorText,
}: {
  label: string
  placeholder: string
  type?: string
  name: string
  value: string
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  helperText?: string
  errorText?: string
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

      {helperText && !errorText && (
        <p className="mt-1 text-xs text-zinc-500">{helperText}</p>
      )}

      {errorText && <p className="mt-1 text-xs text-red-600">{errorText}</p>}
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string
  name: string
  value: string
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
  options: readonly string[]
  disabled?: boolean
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-600">{label}</label>

      <select
        required
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-lg bg-stone-100 px-4 py-3 text-base text-zinc-900 outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
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