import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { LandingNavbar } from "@/components/nav/LandingNavbar"
import { Button } from "@/components/ui/button"
import { supabase } from "@/services/supabase"
import { getUserRoles } from "@/services/authService"
import { useAuth } from "@/providers/auth/useAuth"
import type { AppRole } from "@/types/roles"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const { selectRole } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  async function handleForgotPassword() {
    setErrorMessage("")

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setErrorMessage("Ingresá tu correo electrónico para recuperar la contraseña.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setErrorMessage("No se pudo enviar el correo de recuperación. Intentá nuevamente.")
      return
    }

    setErrorMessage("Te enviamos un correo para restablecer tu contraseña.")
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

  return (
    <>
      <LandingNavbar />

      <main className="min-h-screen bg-white">
        <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-20 px-8 py-16 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-md">
            <div>
              <h1 className="text-5xl font-extrabold text-zinc-900">
                Bienvenido de nuevo
              </h1>

              <p className="mt-4 text-base font-medium text-zinc-600">
                Accede al portal oficial para estudiantes y profesores.
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
                  placeholder="ejemplo@correo.com"
                  className="mt-2 w-full rounded-3xl bg-stone-100 px-5 py-4 text-base outline-none transition focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-900">
                    Contraseña
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-red-700"
                  >
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
                    className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-16 w-full rounded-3xl bg-gradient-to-r from-red-700 to-red-600 text-lg font-bold shadow-xl shadow-red-700/20 hover:from-red-800 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Ingresando..." : "Iniciar Sesión →"}
              </Button>

              <div className="relative flex items-center py-2">
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
                  if (error) setErrorMessage("No se pudo iniciar sesión con Google.")
                }}
                className="h-16 w-full rounded-3xl bg-white border-2 border-stone-200 text-lg font-bold text-zinc-700 hover:bg-stone-50 hover:text-zinc-900 transition flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Continuar con Google
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

              <p className="pt-4 text-center text-xs text-zinc-600">
                © 2026 Centro de Capacitación G&G.
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
              className="h-[720px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-10 left-8 right-8 text-white">
              <span className="rounded-full bg-red-600 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                Inscripciones abiertas
              </span>

              <h2 className="mt-5 text-5xl font-extrabold leading-tight text-white">
                Centro de Capacitación
                <br />
                G&G
              </h2>

              <p className="mt-4 text-lg font-light text-stone-100/90">
                “Forjando el futuro de la pastelería artesanal con técnica y
                pasión.”
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}