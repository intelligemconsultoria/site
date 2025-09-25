const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUserProduction() {
  console.log('🚀 Criando usuário para produção...\n');

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
      console.log('❌ Erro:', error.message);
      
      if (error.message.includes('already registered')) {
        console.log('\n✅ Usuário já existe!');
        console.log('📧 Email:', email);
        console.log('🔑 Senha:', password);
        console.log('🔗 Acesse: https://siteintelligem.netlify.app/admin');
        console.log('\n💡 Se não conseguir fazer login:');
        console.log('1. Verifique a senha no painel do Supabase');
        console.log('2. Ou use "Esqueci minha senha"');
        console.log('3. Ou configure o Site URL no Supabase Dashboard');
      }
    } else {
      console.log('✅ Usuário criado!');
      console.log('📧 Email:', data.user?.email);
      console.log('🆔 ID:', data.user?.id);
      console.log('🔗 Link de confirmação enviado para:', data.user?.email);
      console.log('🌐 URL de redirecionamento: https://siteintelligem.netlify.app/admin');
    }

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message);
  }
}

createUserProduction().catch(console.error);
