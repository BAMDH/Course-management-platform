import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { supabase } from "@/services/supabase"
import { getUserRoles } from "@/services/authService"
import { useAuth } from "@/providers/auth/useAuth"
import type { AppRole } from "@/types/roles"

export default function LoginPage() {
  const navigate = useNavigate()
  const { selectRole } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberSession, setRememberSession] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [availableRoles, setAvailableRoles] = useState<AppRole[]>([])
  const [showPassword, setShowPassword] = useState(false)

  function getRouteByRole(role: AppRole) {
    if (role === "admin") return "/admin"
    if (role === "teacher") return "/teacher"
    return "/student"
  }

  function getRoleLabel(role: AppRole) {
    if (role === "admin") return "Administrador"
    if (role === "teacher") return "Profesor"
    return "Estudiante"
  }

  function handleSelectRole(role: AppRole) {
    selectRole(role)
    navigate(getRouteByRole(role))
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage("")
    setAvailableRoles([])
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage("Correo o contraseña incorrectos.")
      setIsLoading(false)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user.id

    if (!userId) {
      setErrorMessage("No se pudo obtener la sesión del usuario.")
      setIsLoading(false)
      return
    }

    const roles = await getUserRoles(userId)

    if (roles.length === 0) {
      navigate("/unauthorized")
      return
    }

    if (roles.length === 1) {
      selectRole(roles[0])
      navigate(getRouteByRole(roles[0]))
      return
    }

    setAvailableRoles(roles)
    setIsLoading(false)
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-20 px-8 py-16 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h1 className="text-5xl font-extrabold text-zinc-900">
              Bienvenido de nuevo
            </h1>

            <p className="mt-4 text-base font-medium text-zinc-600">
              Accede al portal oficial para Estudiantes y Profesores.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            {errorMessage && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-zinc-900">
                Correo Electrónico
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ejemplo@culinaria.com"
                className="mt-2 w-full rounded-3xl bg-stone-100 px-5 py-4 text-base outline-none transition focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-zinc-900">
                  Contraseña
                </label>

                <button type="button" className="text-xs font-semibold text-red-700">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-3xl bg-stone-100 px-5 py-4 pr-14 text-base outline-none transition focus:ring-2 focus:ring-red-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(event) => setRememberSession(event.target.checked)}
                className="h-5 w-5 rounded border-red-200"
              />

              <span className="text-sm font-medium text-zinc-600">
                Mantener sesión iniciada
              </span>
            </label>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-16 w-full rounded-3xl bg-gradient-to-r from-red-700 to-red-600 text-lg font-bold shadow-xl shadow-red-700/20 hover:from-red-800 hover:to-red-700"
            >
              {isLoading ? "Ingresando..." : "Iniciar Sesión →"}
            </Button>

            {availableRoles.length > 1 && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="mb-3 text-sm font-semibold text-zinc-900">
                  Seleccioná con qué perfil querés ingresar:
                </p>

                <div className="grid gap-2">
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleSelectRole(role)}
                      className="rounded-xl bg-white px-4 py-3 text-left font-semibold text-zinc-800 hover:bg-red-100"
                    >
                      {getRoleLabel(role)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center py-4">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="px-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                O inicia sesión con
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex h-16 w-full items-center justify-center gap-3 rounded-3xl border-2 border-neutral-200 bg-stone-50 transition hover:bg-neutral-100"
            >
              <GoogleLogo />

              <span className="text-lg font-bold text-zinc-900">
                Continuar con Google
              </span>
            </button>

            <p className="pt-4 text-center text-xs text-zinc-600">
              © 2026 Centro De Capacitación G&G.
            </p>

            <p className="text-center text-sm text-zinc-600">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="font-semibold text-red-700">
                Registrarse
              </Link>
            </p>
          </form>
        </div>

        <div className="relative hidden overflow-hidden rounded-3xl shadow-2xl lg:block">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop"
            alt="Pastelería artesanal"
            className="h-[760px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute bottom-10 left-8 right-8 text-white">
            <span className="rounded-full bg-red-600 px-4 py-1 text-xs font-bold uppercase tracking-wider">
              Inscripciones abiertas
            </span>

            <h2 className="mt-5 text-5xl font-extrabold leading-tight">
              Centro de Capacitación
              <br />
              G&G
            </h2>

            <p className="mt-4 text-lg font-light text-stone-100/90">
              “Forjando el futuro de la pastelería artesanal con técnica y pasión.”
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function GoogleLogo() {
  return (
    <div className="relative h-5 w-5 overflow-hidden">
      <div className="absolute left-[10px] top-[8px] h-2 w-2 bg-[#4285F4]" />
      <div className="absolute left-[2px] top-[12px] h-2 w-4 bg-[#34A853]" />
      <div className="absolute left-[1px] top-[6px] h-2 w-1 bg-[#FBBC05]" />
      <div className="absolute left-[2px] top-[1px] h-2 w-4 bg-[#EA4335]" />
    </div>
  )
}