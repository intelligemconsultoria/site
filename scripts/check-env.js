console.log('🔍 Verificando variáveis de ambiente...\n');

console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'NÃO DEFINIDA');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA');

if (process.env.VITE_SUPABASE_ANON_KEY) {
  console.log('Chave (primeiros 20 chars):', process.env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...');
}

console.log('\n📋 Para configurar no Netlify:');
console.log('1. Acesse: https://app.netlify.com/sites/siteintelligem/settings/deploys');
console.log('2. Vá em: Environment Variables');
console.log('3. Adicione:');
console.log('   VITE_SUPABASE_URL = https://abfowubusomlibuihqrz.supabase.co');
console.log('   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk');
console.log('4. Salve e faça novo deploy');
