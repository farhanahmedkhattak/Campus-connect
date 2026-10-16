import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Fallback dummy client if credentials are not yet configured in .env.local
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Validates whether an email belongs to an authorized educational institution (.edu or .edu.pk)
 */
export function validateEduEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu(\.pk)?$/i;
  return regex.test(email.trim());
}

/**
 * Checks if the email specifically belongs to Air University Kamra domain
 */
export function isAirUniversityDomain(email) {
  if (!email) return false;
  return /@([a-zA-Z0-9.-]+\.)?au\.edu\.pk$/i.test(email.trim());
}
