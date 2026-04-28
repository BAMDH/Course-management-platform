import type { User } from '@supabase/supabase-js';
import type { AppRole } from '@/types/roles';

export interface AuthContextValue {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
}

export interface AuthProviderProps {
  readonly children: React.ReactNode;
}