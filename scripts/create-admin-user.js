const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlicXVpaHFyeiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM4NzQ5NzQwLCJleHAiOjIwNTQzMjU3NDB9.8Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  console.log('🚀 Criando usuário administrador...\n');

  const adminEmail = 'admin@intelligem.com';
  const adminPassword = 'IntelliGem2025!';

  try {
    // Criar usuário no Supabase Auth via signup
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        emailRedirectTo: 'https://siteintelligem.netlify.app/admin'
      }
    });

    if (error) {
      console.error('❌ Erro ao criar usuário:', error.message);
      
      // Se o usuário já existe, informar
      if (error.message.includes('already registered')) {
        console.log('ℹ️  Usuário já existe! Você pode fazer login diretamente.');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Senha:', adminPassword);
        console.log('🔗 Acesse: https://siteintelligem.netlify.app/admin');
      }
      return;
    }

    if (data.user) {
      console.log('✅ Usuário administrador criado com sucesso!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Senha:', adminPassword);
      console.log('🆔 User ID:', data.user.id);
      
      if (data.user.email_confirmed_at) {
        console.log('✅ Email confirmado automaticamente');
      } else {
        console.log('📧 Verifique seu email para confirmar a conta');
      }
      
      console.log('\n📋 Próximos passos:');
      console.log('1. Teste o login em: https://siteintelligem.netlify.app/admin');
      console.log('2. Altere a senha padrão após o primeiro login');
      console.log('3. Configure outras contas admin conforme necessário');
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };
