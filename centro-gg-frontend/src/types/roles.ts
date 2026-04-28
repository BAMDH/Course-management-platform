export type AppRole = 'student' | 'teacher' | 'admin';

export interface AuthUserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: AppRole;
  status: 'active' | 'blocked';
}