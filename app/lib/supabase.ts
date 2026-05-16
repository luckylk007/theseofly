import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// In Vite/React Router 7, environment variables can come from:
// 1. import.meta.env (baked in at build time for client)
// 2. process.env (available at runtime for server)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : undefined);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : undefined);

if (!supabaseUrl || !supabaseAnonKey) {
  // We log to console error so it shows up in deployment logs
  console.error('❌ Supabase configuration error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.');
  
  // Only throw in production server-side to prevent silent failures that lead to cryptic deployment errors
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    throw new Error('Missing Supabase environment variables in production server.');
  }
}

export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '');



