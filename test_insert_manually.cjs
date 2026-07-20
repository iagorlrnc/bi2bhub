const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Tentando logar com admin@accounting.com...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@accounting.com',
    password: 'password123'
  });
  
  if (error) {
    console.error("Login falhou:", error.message);
  } else {
    console.log("Login sucesso:", data.user.email);
  }
}

run();
