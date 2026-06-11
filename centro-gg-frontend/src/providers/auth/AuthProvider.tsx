import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { supabase } from "@/services/supabase"
import { getUserRoles } from "@/services/authService"
import { AuthContext } from "./useAuth"
import type { AppRole } from "@/types/roles"
import type { AuthProviderProps } from "./auth.types"

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<AppRole[]>([])
  const [role, setRole] = useState<AppRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function resolveRole(currentUser: User | null) {
      if (!currentUser) {
        if (isMounted) {
          setRoles([])
          setRole(null)
          setLoading(false)
        }
        return
      }

      const currentRoles = await getUserRoles(currentUser.id)

      const selectedRole = localStorage.getItem("selected_app_role") as AppRole | null

      if (isMounted) {
        setRoles(currentRoles)

        if (selectedRole && currentRoles.includes(selectedRole)) {
          setRole(selectedRole)
        } else {
          setRole(null)
          localStorage.removeItem("selected_app_role")
        }

        setLoading(false)
      }
    }

    async function loadSession() {
      setLoading(true)

      const { data } = await supabase.auth.getSession()
      const currentUser = data.session?.user ?? null

      if (isMounted) {
        setUser(currentUser)
        setRole(null)
      }

      await resolveRole(currentUser)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null

        setLoading(true)
        setUser(currentUser)
        setRole(null)

        setTimeout(() => {
          resolveRole(currentUser)
        }, 0)
      }
    )

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const selectRole = (selectedRole: AppRole) => {
    if (!roles.includes(selectedRole)) return

    localStorage.setItem("selected_app_role", selectedRole)
    setRole(selectedRole)
  }


  const value = useMemo(
    () => ({
      user,
      role,
      roles,
      loading,
      selectRole,
    }),
    [user, role, roles, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}