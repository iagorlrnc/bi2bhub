const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler o arquivo .env manualmente
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

console.log("Supabase URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Tentando logar com admin@accounting.com...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@accounting.com',
    password: 'password123'
  });
  
  if (error) {
    console.error("Erro no Login do Admin:", error);
  } else {
    console.log("Login com Sucesso! Usuário logado:", data.user.email);
  }
}

run();
