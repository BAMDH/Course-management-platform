import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth/useAuth"
import { supabase } from "@/services/supabase"

export function LandingNavbar() {
  const { user, role } = useAuth()
  const location = useLocation()

  function getPanelRoute() {
    if (role === "admin") return "/admin"
    if (role === "teacher") return "/teacher"
    return "/student"
  }

  async function handleLogout() {
    localStorage.removeItem("selected_app_role")
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src="/logo-gyg.png"
            alt="Centro de Capacitación G&G"
            className="h-14 w-auto"
          />

          <Link
            to="/"
            className="text-sm font-extrabold uppercase tracking-wide text-red-600 transition hover:text-red-700 md:text-base"
          >
            Centro de Capacitación G&G
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-zinc-600 transition-all duration-300 hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.35)]"
          >
            Inicio
          </Link>

          <Link
            to="/courses"
            className="text-sm font-semibold text-zinc-600 transition-all duration-300 hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.35)]"
          >
            Cursos
          </Link>

          <Link
            to="/about"
            className="text-sm font-semibold text-zinc-600 transition-all duration-300 hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.35)]"
          >
            Nosotros
          </Link>

          <Link
            to="/contact"
            className="text-sm font-semibold text-zinc-600 transition-all duration-300 hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.35)]"
          >
            Contacto
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              {location.pathname !== "/login" && (
                <Button
                  asChild
                  variant="secondary"
                  className="hidden bg-zinc-900 text-white hover:bg-zinc-800 md:inline-flex"
                >
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
              )}

              {location.pathname !== "/register" && (
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link to="/register">Registrarse</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                asChild
                variant="secondary"
                className="hidden bg-zinc-900 text-white hover:bg-zinc-800 md:inline-flex"
              >
                <Link to={getPanelRoute()}>Mi panel</Link>
              </Button>

              <Button
                type="button"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                Cerrar sesión
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}