'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthenticatedUserProvider } from '@/contexts/AuthenticatedUserContext';
import AIChat from '@/components/dashboard/AIChat';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  // Render nothing while useEffect is redirecting; also satisfies TypeScript
  // that session is non-null before passing it to the provider.
  if (!user || !session) {
    return null;
  }

  return (
    <AuthenticatedUserProvider user={user} session={session} signOut={signOut}>
      {children}
      <AIChat />
    </AuthenticatedUserProvider>
  );
}
