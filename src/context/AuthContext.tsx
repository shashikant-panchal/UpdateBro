import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbProfile } from '../types/database';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: DbProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithGoogleIdToken: (credential: string) => Promise<{ data: any; error: any }>;
  signInWithOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  updatePhone: (phone: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<DbProfile>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch or create profile for authenticated user
  const fetchProfile = async (currentUserId: string, currentUser?: User | null) => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, shipping_address, role, created_at')
        .eq('id', currentUserId)
        .maybeSingle();

      if (data && !error) {
        setProfile(data as DbProfile);
      } else if (!data) {
        // Fallback: auto-create initial profile row if trigger hasn't fired yet
        const rawMeta = currentUser?.user_metadata || {};
        const fallbackName =
          rawMeta.full_name ||
          rawMeta.name ||
          (currentUser?.email ? currentUser.email.split('@')[0] : 'UB Customer');
        const fallbackPhone = currentUser?.phone || rawMeta.phone || null;

        const { data: newProfile, error: insertErr } = await supabase
          .from('profiles')
          .insert({
            id: currentUserId,
            full_name: fallbackName,
            email: currentUser?.email || null,
            phone: fallbackPhone,
            role: 'customer',
          })
          .select('id, full_name, email, phone, shipping_address, role, created_at')
          .single();

        if (newProfile && !insertErr) {
          setProfile(newProfile as DbProfile);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check if returning from Google OAuth with an error query/hash
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const oauthErr =
        searchParams.get('error_description') ||
        searchParams.get('error') ||
        hashParams.get('error_description') ||
        hashParams.get('error');

      if (oauthErr) {
        console.warn('Google OAuth Authentication Error:', oauthErr);
        // Clean URL to prevent error parameters lingering in browser address bar
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {}

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user);
      } else {
        setIsLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        fetchProfile(newSession.user.id, newSession.user);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      alert('Supabase is not configured yet. Please check your configuration.');
      return;
    }
    const redirectOrigin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://www.updatebro.in';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectOrigin,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    });
    if (error) throw error;
  };

  const signInWithGoogleIdToken = async (credential: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured yet.') };
    }
    const res = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    });
    if (res.data?.session) {
      setSession(res.data.session);
      setUser(res.data.session.user);
      await fetchProfile(res.data.session.user.id, res.data.session.user);
    }
    return res;
  };

  const signInWithOtp = async (phone: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured yet.') };
    }
    const formatted = phone.startsWith('+91') ? phone : `+91${phone.replace(/^\+?91/, '').trim()}`;
    const { error } = await supabase.auth.signInWithOtp({
      phone: formatted,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const verifyOtp = async (phone: string, token: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured yet.') };
    }
    const formatted = phone.startsWith('+91') ? phone : `+91${phone.replace(/^\+?91/, '').trim()}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token,
      type: 'sms',
    });
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
      await fetchProfile(data.session.user.id, data.session.user);
    }
    return { error: error ? new Error(error.message) : null };
  };

  const updatePhone = async (phone: string) => {
    if (!user) return { error: new Error('No user is currently signed in.') };
    const formatted = phone.startsWith('+91') ? phone : `+91${phone.replace(/^\+?91/, '').trim()}`;

    const { error } = await supabase
      .from('profiles')
      .update({ phone: formatted })
      .eq('id', user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, phone: formatted } : null));
    }
    return { error: error ? new Error(error.message) : null };
  };

  const updateProfile = async (updates: Partial<DbProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithGoogleIdToken,
        signInWithOtp,
        verifyOtp,
        updatePhone,
        updateProfile,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
