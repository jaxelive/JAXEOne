
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithOtp: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isConfigured: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      console.log('Supabase is not configured. Please add your credentials to .env');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session ? 'Found' : 'Not found');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'Session active' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const signUp = async (email: string, password: string) => {
    if (!configured) {
      return { error: { message: 'Supabase is not configured' } as AuthError };
    }
    
    console.log('Signing up user:', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
    } else {
      console.log('Sign up successful');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    if (!configured) {
      return { error: { message: 'Supabase is not configured' } as AuthError };
    }
    
    console.log('Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
    } else {
      console.log('Sign in successful');
    }
    
    return { error };
  };

  const signInWithOtp = async (email: string) => {
    if (!configured) {
      return { error: { message: 'Supabase is not configured' } as AuthError };
    }
    
    console.log('Sending OTP to:', email);
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    
    if (error) {
      console.error('OTP error:', error.message);
    } else {
      console.log('OTP sent successfully');
    }
    
    return { error };
  };

  const signOut = async () => {
    if (!configured) {
      return { error: { message: 'Supabase is not configured' } as AuthError };
    }
    
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      console.log('Sign out successful');
    }
    
    return { error };
  };

  return (
    <SupabaseContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signInWithOtp,
        signOut,
        isConfigured: configured,
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
