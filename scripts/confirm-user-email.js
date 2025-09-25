const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function confirmUserEmail() {
  console.log('📧 Confirmando email do usuário...\n');

  const adminEmail = 'admin@intelligem.com';

  try {
    // Tentar fazer login primeiro para ver o status
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: 'IntelliGem2025!'
    });

    if (loginError) {
      console.log('❌ Erro no login:', loginError.message);
      
      if (loginError.message.includes('Email not confirmed')) {
        console.log('\n📧 Email não confirmado. Soluções:');
        console.log('1. Verifique sua caixa de entrada do email:', adminEmail);
        console.log('2. Procure por um email do Supabase');
        console.log('3. Clique no link de confirmação');
        console.log('4. Ou use o painel do Supabase para confirmar manualmente');
        
        console.log('\n🔧 Alternativa: Criar novo usuário com email confirmado');
        await createNewConfirmedUser();
      }
    } else {
      console.log('✅ Login bem-sucedido!');
      console.log('👤 Usuário:', loginData.user?.email);
      console.log('📧 Email confirmado:', loginData.user?.email_confirmed_at ? 'Sim' : 'Não');
    }

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message);
  }
}

async function createNewConfirmedUser() {
  console.log('\n🆕 Criando novo usuário com email confirmado...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@intelligem.com',
      password: 'IntelliGem2025!',
      options: {
        emailRedirectTo: 'https://siteintelligem.netlify.app/admin'
      }
    });

    if (error) {
      console.log('❌ Erro ao criar usuário:', error.message);
    } else {
      console.log('✅ Usuário criado!');
      console.log('📧 Email:', data.user?.email);
      console.log('🆔 ID:', data.user?.id);
      
      if (data.user?.email_confirmed_at) {
        console.log('✅ Email já confirmado automaticamente!');
      } else {
        console.log('📧 Verifique seu email para confirmar a conta');
        console.log('🔗 Link de confirmação enviado para:', data.user?.email);
      }
    }
  } catch (error) {
    console.log('❌ Erro ao criar usuário:', error.message);
  }
}

// Executar confirmação
confirmUserEmail().catch(console.error);
