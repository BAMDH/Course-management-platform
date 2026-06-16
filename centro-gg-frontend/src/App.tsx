import { AppRouter } from './components/router/AppRouter';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

export function App() {
  return (
    <>
      <AppRouter />
      <SpeedInsights />
      <Analytics />
    </>
  );
}