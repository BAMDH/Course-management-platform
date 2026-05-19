import { useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { supabase } from "@/services/supabase"
import { getUserRole } from "@/services/authService"
import { AuthContext } from "./useAuth"
import type { AppRole } from "@/types/roles"
import type { AuthProviderProps } from "./auth.types"

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<AppRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function resolveRole(currentUser: User | null) {
      if (!currentUser) {
        if (isMounted) {
          setRole(null)
          setLoading(false)
        }
        return
      }

      const currentRole = await getUserRole(currentUser.id)

      if (isMounted) {
        setRole(currentRole)
        setLoading(false)
      }
    }

    async function loadSession() {
      setLoading(true)

      const { data } = await supabase.auth.getSession()
      const currentUser = data.session?.user ?? null

      if (isMounted) {
        setUser(currentUser)
      }

      await resolveRole(currentUser)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null

        setUser(currentUser)
        setLoading(true)

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

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
    }),
    [user, role, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}