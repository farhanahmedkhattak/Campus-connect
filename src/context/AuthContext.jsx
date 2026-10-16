import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, validateEduEmail } from '../lib/supabase';
import { DEMO_USERS } from '../constants/auKamra';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEMO_USERS.student);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  // Load profile from Supabase profiles table
  const fetchProfile = async (userId) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Could not fetch Supabase profile:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user.id);
        if (p) {
          setProfile(p);
          setIsDemoMode(false);
        }
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          if (p) {
            setProfile(p);
            setIsDemoMode(false);
          }
        } else {
          setUser(null);
          // Revert to demo student if signed out
          setProfile(DEMO_USERS.student);
          setIsDemoMode(true);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Google OAuth with Air University domain restriction
  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!supabase) {
      setAuthError('Supabase is not configured yet. Add credentials to .env.local');
      return { error: 'Not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            // Prompt student to pick their university Google Workspace account
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
      return { data };
    } catch (err) {
      setAuthError(err.message);
      return { error: err.message };
    }
  };

  // Email Sign In with .edu verification
  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    if (!validateEduEmail(email)) {
      const err = 'CampusConnect requires an official institutional email ending in .edu.pk or .edu';
      setAuthError(err);
      return { error: err };
    }

    if (!supabase) {
      setAuthError('Supabase is running in mock/demo mode. Use the role switcher bar to test roles.');
      return { error: 'Not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      setUser(data.user);
      const p = await fetchProfile(data.user.id);
      if (p) setProfile(p);
      setIsDemoMode(false);
      return { data };
    } catch (err) {
      setAuthError(err.message);
      return { error: err.message };
    }
  };

  // Student Sign Up
  const signUpWithEmail = async ({ email, password, fullName, department, studentId, batchYear }) => {
    setAuthError(null);
    if (!validateEduEmail(email)) {
      const err = 'Air University registration requires an email ending with .edu.pk or .edu';
      setAuthError(err);
      return { error: err };
    }

    if (!supabase) {
      setAuthError('Supabase is not yet connected in .env.local.');
      return { error: 'Not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            department,
            student_id: studentId.trim(),
            batch_year: Number(batchYear),
          },
        },
      });

      if (error) throw error;
      return { data };
    } catch (err) {
      setAuthError(err.message);
      return { error: err.message };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(DEMO_USERS.student);
    setIsDemoMode(true);
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (isDemoMode || !supabase) {
      setProfile((prev) => ({ ...prev, ...updates }));
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data };
    } catch (err) {
      setAuthError(err.message);
      return { error: err.message };
    }
  };

  // Switch demo user
  const setDemoUser = (demoUser) => {
    setProfile(demoUser);
    setIsDemoMode(true);
  };

  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin';
  const isFaculty = profile?.role === 'faculty' || profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    profile,
    loading,
    authError,
    setAuthError,
    isConfigured: isSupabaseConfigured,
    isDemoMode,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    setDemoUser,
    isModerator,
    isFaculty,
    isAdmin,
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
