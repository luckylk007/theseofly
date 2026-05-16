import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalCheck() {
  console.log('🏁 Final Setup Verification for Theseofly');
  console.log('-----------------------------------------');

  // 1. Check Table Integrity
  const tables = ['profiles', 'websites', 'pages', 'media', 'seo_metadata'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ Table "${table}": Missing or RLS Error (${error.message})`);
    } else {
      console.log(`✅ Table "${table}": Online & Verified`);
    }
  }

  // 2. Check Storage Integrity
  const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
  const hasMediaBucket = buckets?.find(b => b.name === 'media');
  if (storageError) {
    console.log(`❌ Storage: Connection Error (${storageError.message})`);
  } else if (!hasMediaBucket) {
    console.log('⚠️ Storage: "media" bucket not found. Please create it in Supabase dashboard.');
  } else {
    console.log('✅ Storage: "media" bucket is live.');
  }

  // 3. Check Auth Config
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.log(`❌ Auth: Configuration Error (${authError.message})`);
  } else {
    console.log('✅ Auth: Service is healthy.');
  }

  console.log('-----------------------------------------');
}

finalCheck();
