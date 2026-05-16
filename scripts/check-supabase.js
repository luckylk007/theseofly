import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log(`Key length: ${supabaseAnonKey ? supabaseAnonKey.length : 0}`);
console.log(`Key start: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 10) : 'none'}`);
console.log(`Key end: ${supabaseAnonKey ? supabaseAnonKey.substring(supabaseAnonKey.length - 10) : 'none'}`);

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url')) {
  console.error('❌ Error: Missing or invalid Supabase environment variables in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('📡 Testing Supabase connection...');
  console.log(`🔗 URL: ${supabaseUrl}`);

  try {
    // 1. Test basic client initialization and a simple query
    const { data, error } = await supabase.from('websites').select('*').limit(1);

    if (error) {
      console.error('❌ Supabase Error Object:', JSON.stringify(error, null, 2));
      if (error.code === 'PGRST116') {
        console.log('✅ Connected to Supabase!');
        console.log('⚠️ Note: "profiles" table exists but is empty or RLS is blocking access.');
      } else if (error.message && error.message.includes('relation "public.profiles" does not exist')) {
        console.error('❌ Error: The "profiles" table does not exist. Did you run the schema.sql?');
      } else {
        console.error('❌ Supabase Error:', error.message || 'No error message provided');
      }
    } else {
      console.log('✅ Connected to Supabase successfully!');
      console.log('📊 Connection verified with "profiles" table.');
    }

    // 2. Check Auth status
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Auth Error:', authError.message);
    } else {
      console.log('🔐 Auth Service: Online');
    }

  } catch (err) {
    console.error('💥 Unexpected Error:', err);
  }
}

checkConnection();
