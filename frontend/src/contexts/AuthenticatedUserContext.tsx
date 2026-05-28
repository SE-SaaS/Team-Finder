'use client';

import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthenticatedUserContextType {
  user: User;
  session: Session;
  signOut: () => Promise<void>;
}

const AuthenticatedUserContext = createContext<AuthenticatedUserContextType | undefined>(undefined);

export function AuthenticatedUserProvider({
  user,
  session,
  signOut,
  children,
}: {
  user: User;
  session: Session;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedUserContext.Provider value={{ user, session, signOut }}>
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
