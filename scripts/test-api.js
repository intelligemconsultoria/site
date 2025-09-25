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

async function testAPI() {
  console.log('🔍 Testando API diretamente...\n');

  try {
    // Teste 1: Listar artigos existentes
    console.log('1️⃣ Listando artigos existentes...');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (articlesError) {
      console.error('❌ Erro ao listar artigos:', articlesError);
      return;
    }

    console.log(`✅ Encontrados ${articles.length} artigos`);
    if (articles.length > 0) {
      console.log('📄 Último artigo:', articles[0].title);
    }

    // Teste 2: Criar um artigo de teste
    console.log('\n2️⃣ Criando artigo de teste...');
    const testArticle = {
      title: 'Artigo de Teste - ' + new Date().toISOString(),
      excerpt: 'Este é um artigo de teste criado via API',
      content: '# Artigo de Teste\n\nEste é um artigo criado para testar a API.',
      author: 'Sistema de Teste',
      category: 'Tecnologia',
      tags: ['teste', 'api'],
      slug: 'artigo-de-teste-' + Date.now(),
      image_url: '',
      published: true,
      featured: false,
      read_time: '1 min',
      date: new Date().toISOString().split('T')[0]
    };

    const { data: newArticle, error: createError } = await supabase
      .from('articles')
      .insert([testArticle])
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar artigo:', createError);
      return;
    }

    console.log('✅ Artigo criado com sucesso!');
    console.log('🆔 ID:', newArticle.id);
    console.log('📄 Título:', newArticle.title);

    // Teste 3: Verificar se o artigo foi salvo
    console.log('\n3️⃣ Verificando se o artigo foi salvo...');
    const { data: savedArticle, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', newArticle.id)
      .single();

    if (fetchError) {
      console.error('❌ Erro ao buscar artigo:', fetchError);
      return;
    }

    console.log('✅ Artigo encontrado no banco!');
    console.log('📄 Título:', savedArticle.title);
    console.log('📅 Data:', savedArticle.created_at);

    // Teste 4: Deletar o artigo de teste
    console.log('\n4️⃣ Removendo artigo de teste...');
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', newArticle.id);

    if (deleteError) {
      console.error('❌ Erro ao deletar artigo:', deleteError);
      return;
    }

    console.log('✅ Artigo de teste removido!');

    console.log('\n🎉 Todos os testes passaram! A API está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testAPI();
