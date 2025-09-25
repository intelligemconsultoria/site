// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testando chaves de ambiente...\n');

// Verificar se as variáveis estão definidas
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'NÃO DEFINIDA');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA');

if (process.env.VITE_SUPABASE_ANON_KEY) {
  console.log('Chave (primeiros 20 chars):', process.env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...');
}

console.log('\n📋 Para configurar as variáveis:');
console.log('1. Crie um arquivo .env.local na raiz do projeto');
console.log('2. Adicione:');
console.log('   VITE_SUPABASE_URL=https://abfowubusomlibuihqrz.supabase.co');
console.log('   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui');
console.log('3. Execute: npm run dev');
