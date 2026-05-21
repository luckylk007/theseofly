import dotenv from 'dotenv';
dotenv.config();

console.log('Environment variables present:');
for (const key in process.env) {
  if (key.includes('SUPABASE') || key.includes('KEY') || key.includes('SECRET') || key.includes('ROLE')) {
    console.log(`${key}: ${process.env[key] ? 'exists (len ' + process.env[key].length + ')' : 'empty'}`);
  }
}
