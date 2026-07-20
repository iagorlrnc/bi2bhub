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
  console.log("=== LINHAS DE AUTH.USERS (MOCK FUNCIONANDO) ===");
  const { data: usersData, error: usersError } = await supabase.from('temp_users').select('*');
  if (usersError) {
    console.error("Erro ao ler temp_users:", usersError);
  } else {
    console.log(JSON.stringify(usersData, null, 2));
  }

  console.log("\n=== LINHAS DE AUTH.IDENTITIES (MOCK FUNCIONANDO) ===");
  const { data: idData, error: idError } = await supabase.from('temp_identities').select('*');
  if (idError) {
    console.error("Erro ao ler temp_identities:", idError);
  } else {
    console.log(JSON.stringify(idData, null, 2));
  }
}

run();
