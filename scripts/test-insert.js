import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing insert into pages table...');
  const testPage = {
    title: 'Test Page Title',
    slug: 'test-page-slug-unique-123',
    content: { sections: [{ heading: 'Test Heading', text: 'Test content text' }] },
    status: 'draft',
    is_programmatic: false,
    website_id: '1b51087c-82e7-4983-a31f-730104b6ae43',
  };

  const { data, error } = await supabase
    .from('pages')
    .insert([testPage])
    .select();

  if (error) {
    console.error('❌ Insert failed:', error);
  } else {
    console.log('✅ Insert succeeded:', data);
    
    // Clean up
    const { error: delError } = await supabase
      .from('pages')
      .delete()
      .eq('id', data[0].id);
      
    if (delError) {
      console.error('Cleanup failed:', delError);
    } else {
      console.log('🧹 Cleanup succeeded');
    }
  }
}

testInsert();
