import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { LandingNavbar } from "@/components/nav/LandingNavbar"
import { Button } from "@/components/ui/button"
import { supabase } from "@/services/supabase"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function isValidPassword(value: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value)
  }

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setMessage("")
    setErrorMessage("")

    if (!isValidPassword(password)) {
      setErrorMessage(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      )
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.")
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setErrorMessage("No se pudo actualizar la contraseña. Intentá solicitar un nuevo enlace.")
      setIsLoading(false)
      return
    }

    setMessage("Contraseña actualizada correctamente. Ya podés iniciar sesión.")
    setPassword("")
    setConfirmPassword("")
    setIsLoading(false)

    setTimeout(() => {
      navigate("/login")
    }, 2000)
  }

  return (
    <>
      <LandingNavbar />

      <main className="min-h-screen bg-white">
        <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center justify-center px-8 py-16">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-extrabold text-zinc-900">
              Restablecer contraseña
            </h1>

            <p className="mt-4 text-base font-medium text-zinc-600">
              Ingresá tu nueva contraseña para recuperar el acceso a tu cuenta.
            </p>

            <form onSubmit={handleResetPassword} className="mt-10 space-y-6">
              {errorMessage && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {message && (
                <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-zinc-900">
                  Nueva contraseña
                </label>

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

              <div>
                <label className="text-sm font-semibold text-zinc-900">
                  Confirmar contraseña
                </label>

                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-3xl bg-stone-100 px-5 py-4 pr-14 text-base outline-none transition focus:ring-2 focus:ring-red-200"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    {showConfirmPassword ? (
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
                {isLoading ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}