'use client';

import { ThemeProvider } from 'next-themes';
import AuthProvider from './providers/SessionProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
} 