import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPage() {
  const slug = 'best-electrician-in-mumbai';
  console.log(`Checking for slug: ${slug}`);

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .ilike('slug', slug);

  if (error) {
    console.error('Error fetching page:', error);
  } else {
    console.log('Found pages:', data);
    if (data.length === 0) {
      console.log('No pages found with that slug.');
      
      // Try fetching all pages to see what we have
      const { data: allPages } = await supabase.from('pages').select('slug, status').limit(10);
      console.log('Recent pages:', allPages);
    }
  }
}

checkPage();
