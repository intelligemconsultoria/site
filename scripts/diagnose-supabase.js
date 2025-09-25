const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseSupabase() {
  console.log('🔍 Diagnosticando configuração do Supabase...\n');

  // 1. Testar conexão básica
  console.log('1️⃣ Testando conexão básica...');
  try {
    const { data, error } = await supabase.from('articles').select('count').limit(1);
    if (error) {
      console.log('❌ Erro na conexão:', error.message);
    } else {
      console.log('✅ Conexão com banco de dados OK');
    }
  } catch (err) {
    console.log('❌ Erro de conexão:', err.message);
  }

  // 2. Testar autenticação
  console.log('\n2️⃣ Testando autenticação...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'intelligemconsultoria@gmail.com',
      password: 'IntelliGem2025!'
    });

    if (error) {
      console.log('❌ Erro de autenticação:', error.message);
      console.log('📋 Detalhes do erro:', error);
    } else {
      console.log('✅ Autenticação OK');
      console.log('👤 Usuário:', data.user?.email);
      console.log('🆔 ID:', data.user?.id);
      console.log('📧 Email confirmado:', data.user?.email_confirmed_at ? 'Sim' : 'Não');
    }
  } catch (err) {
    console.log('❌ Erro inesperado na autenticação:', err.message);
  }

  // 3. Verificar configurações de auth
  console.log('\n3️⃣ Verificando configurações de autenticação...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ Erro ao verificar sessão:', error.message);
    } else {
      console.log('✅ Verificação de sessão OK');
      console.log('🔐 Sessão ativa:', data.session ? 'Sim' : 'Não');
    }
  } catch (err) {
    console.log('❌ Erro ao verificar sessão:', err.message);
  }

  // 4. Listar usuários (se possível)
  console.log('\n4️⃣ Tentando listar usuários...');
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.log('❌ Não é possível listar usuários (normal com anon key):', error.message);
    } else {
      console.log('✅ Usuários encontrados:', data.users?.length || 0);
      data.users?.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
      });
    }
  } catch (err) {
    console.log('❌ Erro ao listar usuários:', err.message);
  }

  console.log('\n📋 Resumo do diagnóstico:');
  console.log('🔗 URL:', supabaseUrl);
  console.log('🔑 Chave:', supabaseAnonKey.substring(0, 20) + '...');
  console.log('📧 Email de teste:', 'intelligemconsultoria@gmail.com');
  console.log('🔑 Senha de teste:', 'IntelliGem2025!');
}

// Executar diagnóstico
diagnoseSupabase().catch(console.error);
