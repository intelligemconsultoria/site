const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para criar slug a partir do título
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

// Função para calcular tempo de leitura
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

// Função principal
exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod, path } = event;
    const pathSegments = path.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];

    // Roteamento baseado no método HTTP e endpoint
    switch (httpMethod) {
      case 'GET':
        return await handleGet(endpoint, event, headers);
      case 'POST':
        return await handlePost(endpoint, event, headers);
      case 'PUT':
        return await handlePut(endpoint, event, headers);
      case 'DELETE':
        return await handleDelete(endpoint, event, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Método não permitido' })
        };
    }
  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      })
    };
  }
};

// GET - Buscar dados
async function handleGet(endpoint, event, headers) {
  try {
    switch (endpoint) {
      case 'articles':
        return await getAllArticles(headers);
      case 'published':
        return await getPublishedArticles(headers);
      case 'featured':
        return await getFeaturedArticles(headers);
      case 'categories':
        return await getCategories(headers);
      case 'stats':
        return await getStats(headers);
      case 'subscribers':
        return await getSubscribers(headers);
      default:
        // Se não for um endpoint específico, pode ser um slug de artigo
        if (endpoint && endpoint !== 'blog') {
          return await getArticleBySlug(endpoint, headers);
        }
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Endpoint não encontrado' })
        };
    }
  } catch (error) {
    console.error('Erro no GET:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar dados' })
    };
  }
}

// POST - Criar dados
async function handlePost(endpoint, event, headers) {
  try {
    const body = JSON.parse(event.body || '{}');
    
    switch (endpoint) {
      case 'articles':
        return await createArticle(body, headers);
      case 'subscribe':
        return await subscribeNewsletter(body, headers);
      case 'search':
        return await searchArticles(body, headers);
      case 'filter':
        return await filterArticles(body, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Endpoint não encontrado' })
        };
    }
  } catch (error) {
    console.error('Erro no POST:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao criar dados' })
    };
  }
}

// PUT - Atualizar dados
async function handlePut(endpoint, event, headers) {
  try {
    const body = JSON.parse(event.body || '{}');
    const pathSegments = event.path.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1];
    
    switch (endpoint) {
      case 'articles':
        return await updateArticle(id, body, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Endpoint não encontrado' })
        };
    }
  } catch (error) {
    console.error('Erro no PUT:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao atualizar dados' })
    };
  }
}

// DELETE - Deletar dados
async function handleDelete(endpoint, event, headers) {
  try {
    const pathSegments = event.path.split('/').filter(Boolean);
    const id = pathSegments[pathSegments.length - 1];
    
    switch (endpoint) {
      case 'articles':
        return await deleteArticle(id, headers);
      case 'unsubscribe':
        return await unsubscribeNewsletter(id, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Endpoint não encontrado' })
        };
    }
  } catch (error) {
    console.error('Erro no DELETE:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao deletar dados' })
    };
  }
}

// Funções específicas do Supabase

async function getAllArticles(headers) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar artigos' })
    };
  }
}

async function getPublishedArticles(headers) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao buscar artigos publicados:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar artigos publicados' })
    };
  }
}

async function getArticleBySlug(slug, headers) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Artigo não encontrado' })
        };
      }
      throw error;
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao buscar artigo por slug:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar artigo' })
    };
  }
}

async function getFeaturedArticles(headers) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao buscar artigos em destaque:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar artigos em destaque' })
    };
  }
}

async function getCategories(headers) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('category')
      .eq('published', true);
    
    if (error) throw error;
    
    const categories = [...new Set(data.map(item => item.category))];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(categories)
    };
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar categorias' })
    };
  }
}

async function getStats(headers) {
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
    
    const stats = {
      totalArticles,
      publishedArticles,
      draftArticles: totalArticles - publishedArticles,
      featuredArticles,
      totalSubscribers,
      categories
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(stats)
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar estatísticas' })
    };
  }
}

async function createArticle(articleData, headers) {
  try {
    const article = {
      ...articleData,
      slug: createSlug(articleData.title),
      read_time: calculateReadTime(articleData.content),
      date: articleData.date || new Date().toISOString().split('T')[0]
    };
    
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao criar artigo' })
    };
  }
}

async function updateArticle(id, updateData, headers) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Artigo não encontrado' })
        };
      }
      throw error;
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao atualizar artigo' })
    };
  }
}

async function deleteArticle(id, headers) {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Artigo deletado com sucesso' })
    };
  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao deletar artigo' })
    };
  }
}

async function searchArticles(searchData, headers) {
  try {
    const { query } = searchData;
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro na busca:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro na busca' })
    };
  }
}

async function filterArticles(filterData, headers) {
  try {
    const { category } = filterData;
    
    if (category === 'Todos') {
      return await getPublishedArticles(headers);
    }
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro no filtro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro no filtro' })
    };
  }
}

async function subscribeNewsletter(subscriberData, headers) {
  try {
    const { email } = subscriberData;
    
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email já cadastrado' })
        };
      }
      throw error;
    }
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao inscrever no newsletter:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao inscrever no newsletter' })
    };
  }
}

async function getSubscribers(headers) {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('active', true)
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro ao buscar assinantes:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao buscar assinantes' })
    };
  }
}

async function unsubscribeNewsletter(email, headers) {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .update({ active: false })
      .eq('email', email)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Email não encontrado' })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Descadastrado com sucesso' })
    };
  } catch (error) {
    console.error('Erro ao descadastrar:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao descadastrar' })
    };
  }
}
