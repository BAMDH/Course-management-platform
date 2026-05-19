import { supabase } from "@/services/supabase"
import type { AppRole } from "@/types/roles"

const rolePriority: AppRole[] = ["admin", "teacher", "student"]

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)

  if (error || !data) return []

  return data.map((item) => item.role as AppRole)
}

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const roles = await getUserRoles(userId)

  if (roles.length === 0) return null

  const selectedRole = localStorage.getItem("selected_app_role") as AppRole | null

  if (selectedRole && roles.includes(selectedRole)) {
    return selectedRole
  }

  return rolePriority.find((role) => roles.includes(role)) ?? null
}