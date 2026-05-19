import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProviders } from './providers/AppProviders';
import { AuthContext } from '@/providers/auth/useAuth'; // 1. Import AuthContext
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// 2. Define the mock user and student role value
const mockUser = {
  id: 'mock-student-id',
  email: 'estudiante@prueba.com',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
} as any; // Cast to 'any' to easily satisfy Supabase's strict User type

const mockAuthValue = {
  user: mockUser,
  role: 'student' as const, // Must be 'student' | 'teacher' | 'admin'
  loading: false,
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProviders>
      {/* 3. Wrap App in the mock AuthContext Provider */}
      <AuthContext.Provider value={mockAuthValue}>
        <App />
      </AuthContext.Provider>
    </AppProviders>
  </React.StrictMode>
);
