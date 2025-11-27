'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AppHeader } from '@/components/layout/AppHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">

      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/10 dark:border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/10 dark:border-white/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Dashboard
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}