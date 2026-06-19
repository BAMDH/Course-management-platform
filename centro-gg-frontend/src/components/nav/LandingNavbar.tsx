import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth/useAuth"
import { supabase } from "@/services/supabase"

export function LandingNavbar() {
  const { user, role } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function getPanelRoute() {
    if (role === "admin") return "/admin"
    if (role === "teacher") return "/teacher"
    return "/student"
  }

  async function handleLogout() {
    localStorage.removeItem("selected_app_role")
    await supabase.auth.signOut()
    window.location.href = window.location.origin
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src="/logo-gyg.png"
            alt="Centro de Capacitación G&G"
            className="h-10 w-auto md:h-14"
          />

          <Link
            to="/"
            className="text-xs font-extrabold uppercase tracking-wide text-red-600 transition hover:text-red-700 sm:text-sm md:text-base"
          >
            Centro de Capacitación<br className="sm:hidden"/> G&G
          </Link>
        </div>

        {/* Desktop Navigation */}
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

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              {location.pathname !== "/login" && (
                <Button
                  asChild
                  variant="secondary"
                  className="bg-zinc-900 text-white hover:bg-zinc-800"
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
                className="bg-zinc-900 text-white hover:bg-zinc-800"
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

        {/* Mobile Menu Toggle Button */}
        <button
          className="p-2 text-zinc-600 hover:text-zinc-900 md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="flex flex-col space-y-4 px-4 py-6">
            <Link
              to="/"
              className="text-base font-semibold text-zinc-600 hover:text-red-600"
              onClick={closeMobileMenu}
            >
              Inicio
            </Link>

            <Link
              to="/courses"
              className="text-base font-semibold text-zinc-600 hover:text-red-600"
              onClick={closeMobileMenu}
            >
              Cursos
            </Link>

            <Link
              to="/about"
              className="text-base font-semibold text-zinc-600 hover:text-red-600"
              onClick={closeMobileMenu}
            >
              Nosotros
            </Link>

            <Link
              to="/contact"
              className="text-base font-semibold text-zinc-600 hover:text-red-600"
              onClick={closeMobileMenu}
            >
              Contacto
            </Link>

            <div className="flex flex-col gap-3 pt-4 border-t">
              {!user ? (
                <>
                  {location.pathname !== "/login" && (
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
                      onClick={closeMobileMenu}
                    >
                      <Link to="/login">Iniciar Sesión</Link>
                    </Button>
                  )}

                  {location.pathname !== "/register" && (
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700" onClick={closeMobileMenu}>
                      <Link to="/register">Registrarse</Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
                    onClick={closeMobileMenu}
                  >
                    <Link to={getPanelRoute()}>Mi panel</Link>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Cerrar sesión
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}