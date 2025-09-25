const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3001;

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_secret_FHjvctnadFD436cGuLNSMA_tSh6Wq-6';

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Endpoint para testar artigos
app.get('/api/articles', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para artigos publicados
app.get('/api/published', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const [
      { count: totalArticles },
      { count: publishedArticles },
      { count: featuredArticles },
      { count: totalSubscribers }
    ] = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('published', true),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('featured', true),
      supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('active', true)
    ]);
    
    const { data: categoriesData } = await supabase
      .from('articles')
      .select('category')
      .eq('published', true);
    
    const categories = [...new Set(categoriesData.map(item => item.category))];
    
    res.json({
      totalArticles,
      publishedArticles,
      draftArticles: totalArticles - publishedArticles,
      featuredArticles,
      totalSubscribers,
      categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor de teste rodando em http://localhost:${port}`);
  console.log(`📝 Teste os endpoints:`);
  console.log(`   - http://localhost:${port}/api/articles`);
  console.log(`   - http://localhost:${port}/api/published`);
  console.log(`   - http://localhost:${port}/api/stats`);
});
