'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from 'react-hot-toast';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Theme Toggle in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      < >
        {children}
      </>

      {/* Toast Notifications */}
      <Toaster position="top-center" />
    </>
  );
}