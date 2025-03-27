import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseAuth, supabaseDb } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabaseAuth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        const { data: userProfile } = await supabaseDb.getProfile(session.user.id);
        setProfile(userProfile);
      }
      
      // Set up auth state listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            const { data: userProfile } = await supabaseDb.getProfile(session.user.id);
            setProfile(userProfile);
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      );
      
      setIsLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabaseAuth.signIn(email, password);
      
      if (error) throw error;
      
      navigate('/dashboard');
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as Error };
    }
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      // Create the user in Auth
      const { data, error } = await supabaseAuth.signUp(email, password);
      
      if (error) throw error;
      
      if (data.user) {
        // Create the user profile
        const { error: profileError } = await supabaseDb.createProfile({
          id: data.user.id,
          name,
          email,
        });
        
        if (profileError) throw profileError;
      }
      
      navigate('/dashboard');
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: error as Error };
    }
  }, [navigate]);

  const signOut = useCallback(async () => {
    await supabaseAuth.signOut();
    navigate('/');
  }, [navigate]);

  const value = {
    isAuthenticated: !!user,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
