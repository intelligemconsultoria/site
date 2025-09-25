// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCreateArticle() {
  console.log('🧪 Testando criação de artigo...\n');
  
  const testArticle = {
    title: 'Teste de Artigo',
    excerpt: 'Este é um artigo de teste',
    content: '# Teste\n\nEste é um artigo de teste para verificar se a API está funcionando.',
    author: 'Teste',
    category: 'Tecnologia',
    tags: ['teste', 'api'],
    slug: 'teste-de-artigo',
    image_url: '',
    date: new Date().toISOString().split('T')[0],
    read_time: '1 min',
    published: true,
    featured: false
  };
  
  try {
    console.log('📝 Criando artigo de teste...');
    const { data, error } = await supabase
      .from('articles')
      .insert([testArticle])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar artigo:', error);
      return;
    }
    
    console.log('✅ Artigo criado com sucesso!');
    console.log('🆔 ID:', data.id);
    console.log('📄 Título:', data.title);
    
    // Testar exclusão
    console.log('\n🗑️ Testando exclusão...');
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', data.id);
    
    if (deleteError) {
      console.error('❌ Erro ao excluir artigo:', deleteError);
    } else {
      console.log('✅ Artigo excluído com sucesso!');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testCreateArticle();
