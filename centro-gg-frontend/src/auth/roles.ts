import type { AppRole } from '@/types/roles';

export const ROLES: Record<string, AppRole> = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
} as const;
