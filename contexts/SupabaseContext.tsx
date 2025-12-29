
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/app/integrations/supabase/client';

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Known auth user ID for avelezsanti from the database
const AVELEZSANTI_AUTH_USER_ID = '374a33bc-9c6f-4f19-8ebd-1a3bcfcf878b';
const AVELEZSANTI_EMAIL = 'avelezsanti@placeholder.com';

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[SupabaseContext] Initializing authentication');
    
    // Check for existing session first
    supabase.auth.getSession().then(async ({ data: { session: existingSession }, error }) => {
      if (error) {
        console.error('[SupabaseContext] Error getting session:', error);
      }
      
      if (existingSession) {
        console.log('[SupabaseContext] Existing session found:', existingSession.user.email);
        setSession(existingSession);
        setUser(existingSession.user);
        setLoading(false);
      } else {
        console.log('[SupabaseContext] No existing session, creating mock session with real user ID');
        // Create a mock session with the real auth user ID
        // This allows the app to work with RLS policies that use auth.uid()
        const mockUser: User = {
          id: AVELEZSANTI_AUTH_USER_ID,
          email: AVELEZSANTI_EMAIL,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          role: 'authenticated',
        } as User;

        const mockSession: Session = {
          access_token: 'mock-token-' + AVELEZSANTI_AUTH_USER_ID,
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
          user: mockUser,
        } as Session;

        // Try to set the session in Supabase client
        // This won't work for RLS but will set the user context
        try {
          await supabase.auth.setSession({
            access_token: mockSession.access_token,
            refresh_token: mockSession.refresh_token,
          });
        } catch (err) {
          console.log('[SupabaseContext] Could not set mock session in auth client:', err);
        }

        setUser(mockUser);
        setSession(mockSession);
        setLoading(false);

        console.log('[SupabaseContext] Mock session created with real user ID:', AVELEZSANTI_AUTH_USER_ID);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('[SupabaseContext] Auth state changed:', _event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        session,
        user,
        loading,
        isConfigured: true,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
