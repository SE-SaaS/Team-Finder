import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { BackgroundThemeProvider } from '@/contexts/BackgroundThemeContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

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
    <html lang="en" className={`scroll-smooth ${GeistSans.variable} ${dmSans.variable}`}>
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
