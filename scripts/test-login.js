const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🔐 Testando login com diferentes senhas...\n');

  const email = 'intelligemconsultoria@gmail.com';
  const passwords = [
    'IntelliGem2025!',
    'intelligem2025',
    'IntelliGem2025',
    'intelligem123',
    'admin123',
    'password123'
  ];

  for (const password of passwords) {
    console.log(`🔑 Testando senha: ${password}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log(`❌ ${error.message}`);
      } else {
        console.log(`✅ LOGIN BEM-SUCEDIDO!`);
        console.log(`👤 Usuário: ${data.user?.email}`);
        console.log(`🆔 ID: ${data.user?.id}`);
        console.log(`📧 Email confirmado: ${data.user?.email_confirmed_at ? 'Sim' : 'Não'}`);
        return;
      }
    } catch (err) {
      console.log(`❌ Erro: ${err.message}`);
    }
    
    console.log(''); // Linha em branco
  }

  console.log('❌ Nenhuma senha funcionou.');
  console.log('\n💡 Soluções:');
  console.log('1. Verifique a senha no painel do Supabase');
  console.log('2. Ou me informe qual é a senha correta');
  console.log('3. Ou vamos criar um novo usuário');
}

// Executar teste
testLogin().catch(console.error);
