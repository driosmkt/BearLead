import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type UserRole = 'admin' | 'consultant' | null;

interface AuthContextType {
  user:        User | null;
  session:     Session | null;
  loading:     boolean;
  role:        UserRole;
  isAdmin:     boolean;
  signIn:      (email: string, password: string) => Promise<{ error: string | null }>;
  signOut:     () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role,    setRole]    = useState<UserRole>(null);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_units')
      .select('role')
      .eq('user_id', userId)
      .single();
    setRole((data?.role as UserRole) ?? 'consultant');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else { setRole(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading termina quando temos user + role ou confirmamos ausência
  useEffect(() => {
    if (role !== null || !user) setLoading(false);
  }, [role, user]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isAdmin: role === 'admin', signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
};
