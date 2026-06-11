import { supabase } from "@/services/supabase"
import type { AppRole } from "@/types/roles"

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)

  if (error || !data) return []

  return data.map((item) => item.role as AppRole)
}