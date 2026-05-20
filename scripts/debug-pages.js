
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkPages() {
  if (!supabaseServiceRole) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseServiceRole);

  console.log('--- Checking Pages for website_id issues ---');
  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, title, website_id, status');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const nullWebsite = pages.filter(p => !p.website_id);
  console.log(`Total pages: ${pages.length}`);
  console.log(`Pages with null website_id: ${nullWebsite.length}`);
  if (nullWebsite.length > 0) {
    console.table(nullWebsite);
  }

  // Check websites and owners
  const { data: websites } = await supabase.from('websites').select('id, name, owner_id');
  console.log('--- Websites ---');
  console.table(websites);

  // Check profiles
  const { data: profiles } = await supabase.from('profiles').select('id, email');
  console.log('--- Profiles ---');
  console.table(profiles);
}

checkPages();
