const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserStatus() {
  console.log('🔍 Verificando status do usuário...\n');

  const email = 'intelligemconsultoria@gmail.com';
  const password = 'IntelliGem2025!';

  console.log('📧 Email:', email);
  console.log('🔑 Senha usada nos scripts:', password);
  console.log('');

  try {
    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('❌ Erro no login:', error.message);
      console.log('📋 Código do erro:', error.code || 'N/A');
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 Possíveis causas:');
        console.log('1. Email não confirmado no Supabase');
        console.log('2. Senha incorreta');
        console.log('3. Usuário não existe');
        console.log('4. Problema de configuração');
        
        console.log('\n🔧 Soluções:');
        console.log('1. Verifique seu email para confirmação');
        console.log('2. Ou me informe qual é a senha correta');
        console.log('3. Ou vamos criar um novo usuário');
      }
    } else {
      console.log('✅ LOGIN BEM-SUCEDIDO!');
      console.log('👤 Usuário:', data.user?.email);
      console.log('🆔 ID:', data.user?.id);
      console.log('📧 Email confirmado:', data.user?.email_confirmed_at ? 'Sim' : 'Não');
      console.log('🔐 Último login:', data.user?.last_sign_in_at);
    }

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message);
  }
}

checkUserStatus().catch(console.error);
