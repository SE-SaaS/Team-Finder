'use client';

import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthenticatedUserContextType {
  user: User;
  signOut: () => Promise<void>;
}

const AuthenticatedUserContext = createContext<AuthenticatedUserContextType | undefined>(undefined);

export function AuthenticatedUserProvider({
  user,
  signOut,
  children,
}: {
  user: User;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedUserContext.Provider value={{ user, signOut }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

export function useAuthenticatedUser() {
  const context = useContext(AuthenticatedUserContext);
  if (context === undefined) {
    throw new Error('useAuthenticatedUser must be used inside the authenticated layout');
  }
  return context;
}
