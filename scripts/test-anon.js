import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Attempting anonymous sign in...');
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error('❌ Anon sign in failed:', error);
  } else {
    console.log('✅ Anon sign in succeeded!', data);
  }
}

test();
