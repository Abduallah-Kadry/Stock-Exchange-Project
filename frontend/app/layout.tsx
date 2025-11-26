import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@/components/theme-toggle';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout ({children}: { children: ReactNode; }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </header>
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}