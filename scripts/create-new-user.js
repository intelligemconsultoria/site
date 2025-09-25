const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createNewUser() {
  console.log('🆕 Criando novo usuário administrador...\n');

  const email = 'intelligemconsultoria@gmail.com';
  const password = 'IntelliGem2025!';

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://siteintelligem.netlify.app/admin'
      }
    });

    if (error) {
      console.log('❌ Erro ao criar usuário:', error.message);
      
      if (error.message.includes('already registered')) {
        console.log('ℹ️  Usuário já existe!');
        console.log('💡 Possíveis soluções:');
        console.log('1. Verifique a senha no painel do Supabase');
        console.log('2. Use "Esqueci minha senha" no painel');
        console.log('3. Ou me informe qual é a senha correta');
      }
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('📧 Email:', data.user?.email);
      console.log('🆔 ID:', data.user?.id);
      
      if (data.user?.email_confirmed_at) {
        console.log('✅ Email confirmado automaticamente!');
        console.log('\n🎉 Agora você pode fazer login!');
        console.log('📧 Email:', email);
        console.log('🔑 Senha:', password);
        console.log('🔗 Acesse: https://siteintelligem.netlify.app/admin');
      } else {
        console.log('📧 Verifique seu email para confirmar a conta');
        console.log('🔗 Link de confirmação enviado para:', data.user?.email);
      }
    }

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message);
  }
}

// Executar criação
createNewUser().catch(console.error);
