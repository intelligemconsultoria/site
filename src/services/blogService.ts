// Blog Service - Usa Supabase diretamente em dev, via Netlify Functions em produção
import { supabase } from '../lib/supabase';

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  image_url: string;
  featured: boolean;
  published: boolean;
  slug: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

class BlogService {
  private baseUrl = this.getBaseUrl();

  private getBaseUrl(): string {
    // Em desenvolvimento, usa Supabase diretamente
    // Em produção, usa Netlify Functions
    const isDev = import.meta.env.DEV;
    return isDev ? 'direct-supabase' : '/.netlify/functions/blog';
  }

  // Método auxiliar para fazer requisições HTTP
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      // Em desenvolvimento, usa Supabase diretamente
      console.log('🔧 [DEV] Usando Supabase diretamente para:', endpoint);
      return await this.makeSupabaseRequest(endpoint, options);
    } else {
      // Em produção, usa Netlify Functions
      const url = `${this.baseUrl}/${endpoint}`;
      console.log('🌐 Fazendo requisição para:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      console.log('📡 Resposta recebida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro na resposta:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      try {
        const result = await response.json();
        console.log('✅ JSON parseado com sucesso:', result);
        return result;
      } catch (error) {
        console.error('❌ Erro ao fazer parse do JSON:', error);
        console.log('📄 Conteúdo da resposta:', await response.text());
        throw new Error('Resposta não é um JSON válido');
      }
    }
  }

  // Método para fazer requisições diretas ao Supabase em desenvolvimento
  private async makeSupabaseRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      switch (endpoint) {
        case 'published':
          const { data: publishedData, error: publishedError } = await supabase
            .from('articles')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });
          
          if (publishedError) throw publishedError;
          return publishedData;

        case 'articles':
          const { data: articlesData, error: articlesError } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (articlesError) throw articlesError;
          return articlesData;

        case 'featured':
          const { data: featuredData, error: featuredError } = await supabase
            .from('articles')
            .select('*')
            .eq('featured', true)
            .eq('published', true)
            .order('created_at', { ascending: false });
          
          if (featuredError) throw featuredError;
          return featuredData;

        case 'filter':
          // Para filtros, vamos usar os dados do body da requisição
          const requestBody = options.body ? JSON.parse(options.body as string) : {};
          const { category } = requestBody;
          
          if (category && category !== 'Todos') {
            const { data: filteredData, error: filteredError } = await supabase
              .from('articles')
              .select('*')
              .eq('category', category)
              .eq('published', true)
              .order('created_at', { ascending: false });
            
            if (filteredError) throw filteredError;
            return filteredData;
          } else {
            // Se categoria é 'Todos', retornar todos os artigos publicados
            const { data: allData, error: allError } = await supabase
              .from('articles')
              .select('*')
              .eq('published', true)
              .order('created_at', { ascending: false });
            
            if (allError) throw allError;
            return allData;
          }

        case 'search':
          // Para busca, vamos usar os dados do body da requisição
          const searchBody = options.body ? JSON.parse(options.body as string) : {};
          const { query } = searchBody;
          
          if (query && query.trim()) {
            const { data: searchData, error: searchError } = await supabase
              .from('articles')
              .select('*')
              .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
              .eq('published', true)
              .order('created_at', { ascending: false });
            
            if (searchError) throw searchError;
            return searchData;
          } else {
            // Se não há query, retornar todos os artigos publicados
            const { data: allData, error: allError } = await supabase
              .from('articles')
              .select('*')
              .eq('published', true)
              .order('created_at', { ascending: false });
            
            if (allError) throw allError;
            return allData;
          }

        case 'stats':
          const { count: articlesCount } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('published', true);
          
          const { count: subscribersCount } = await supabase
            .from('newsletter_subscribers')
            .select('*', { count: 'exact', head: true })
            .eq('active', true);
          
          return {
            totalArticles: articlesCount || 0,
            totalSubscribers: subscribersCount || 0
          };

        default:
          // Para slugs de artigos
          const { data: articleData, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', endpoint)
            .single();
          
          if (articleError) {
            if (articleError.code === 'PGRST116') {
              throw new Error('Artigo não encontrado');
            }
            throw articleError;
          }
          return articleData;
      }
    } catch (error) {
      console.error('❌ Erro na requisição Supabase:', error);
      throw error;
    }
  }

  // Métodos para artigos
  async getAllArticles(): Promise<BlogArticle[]> {
    return this.makeRequest('articles');
  }

  async getPublishedArticles(): Promise<BlogArticle[]> {
    return this.makeRequest('published');
  }

  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    try {
      return await this.makeRequest(slug);
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getArticlesByCategory(category: string): Promise<BlogArticle[]> {
    return this.makeRequest('filter', {
      method: 'POST',
      body: JSON.stringify({ category })
    });
  }

  async searchArticles(query: string): Promise<BlogArticle[]> {
    return this.makeRequest('search', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  async getFeaturedArticles(): Promise<BlogArticle[]> {
    return this.makeRequest('featured');
  }

  async createArticle(article: Omit<BlogArticle, 'id' | 'created_at' | 'updated_at'>): Promise<BlogArticle> {
    console.log('📤 blogService.createArticle chamado:', { title: article.title, published: article.published });
    
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      // Em desenvolvimento, usa Supabase diretamente
      console.log('🔧 [DEV] Criando artigo via Supabase direto');
      
      // Criar slug se não existir
      const slug = article.slug || this.createSlug(article.title);
      
      // Calcular tempo de leitura se não existir
      const readTime = article.read_time || this.calculateReadTime(article.content);
      
      const articleData = {
        ...article,
        slug,
        read_time: readTime,
        date: article.date || new Date().toISOString().split('T')[0]
      };
      
      const { data, error } = await supabase
        .from('articles')
        .upsert([articleData], { 
          onConflict: 'slug',
          ignoreDuplicates: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('📥 blogService.createArticle retornou:', data);
      return data;
    } else {
      // Em produção, usa Netlify Functions
      const result = await this.makeRequest('articles', {
        method: 'POST',
        body: JSON.stringify(article)
      });
      console.log('📥 blogService.createArticle retornou:', result);
      return result;
    }
  }

  // Função auxiliar para criar slug
  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  }

  // Função auxiliar para calcular tempo de leitura
  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  }

  async updateArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | null> {
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      // Em desenvolvimento, usa Supabase diretamente
      console.log('🔧 [DEV] Atualizando artigo via Supabase direto:', { id, updates });
      
      // Se o ID parece ser um slug (contém hífens mas não é UUID), buscar por slug
      if (id.includes('-') && !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log('🔍 [DEV] ID parece ser um slug, buscando artigo por slug:', id);
        
        // Buscar artigo por slug primeiro
        const { data: existingArticle, error: findError } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', id)
          .single();
        
        if (findError || !existingArticle) {
          console.log('❌ [DEV] Artigo não encontrado por slug:', id);
          throw new Error('Artigo não encontrado');
        }
        
        // Atualizar usando o ID real
        const { data, error } = await supabase
          .from('articles')
          .update(updates)
          .eq('id', existingArticle.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // É um UUID real, atualizar diretamente
        const { data, error } = await supabase
          .from('articles')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } else {
      // Em produção, usa Netlify Functions
      try {
        return await this.makeRequest(`articles/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        });
      } catch (error) {
        if (error.message.includes('404')) {
          return null;
        }
        throw error;
      }
    }
  }

  async deleteArticle(id: string): Promise<boolean> {
    try {
      await this.makeRequest(`articles/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      if (error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  // Métodos para newsletter
  async subscribeToNewsletter(email: string): Promise<boolean> {
    try {
      await this.makeRequest('subscribe', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return true;
    } catch (error) {
      console.error('Erro ao inscrever no newsletter:', error);
      return false;
    }
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return this.makeRequest('subscribers');
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    try {
      await this.makeRequest(`unsubscribe/${email}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Erro ao descadastrar do newsletter:', error);
      return false;
    }
  }

  // Método para obter categorias únicas
  async getCategories(): Promise<string[]> {
    return this.makeRequest('categories');
  }

  // Método para obter estatísticas
  async getStats() {
    return this.makeRequest('stats');
  }
}

export const blogService = new BlogService();