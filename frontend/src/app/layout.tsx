import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { BackgroundThemeProvider } from '@/contexts/BackgroundThemeContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TeamFinder - Built by ChaosX',
  description: 'AI-powered team formation for the next generation of builders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <BackgroundThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </BackgroundThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
