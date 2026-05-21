import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  const { data, error } = await supabase
    .from('pages')
    .select('*, seo_metadata(*)')
    .limit(1);

  if (error) {
    console.error('Error fetching page:', error);
  } else {
    console.log('Sample Page Object:');
    console.log(JSON.stringify(data[0] || null, null, 2));
  }
}

inspect();
