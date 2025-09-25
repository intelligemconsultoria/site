// Blog Service - Usa Supabase via Netlify Functions
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
    // Sempre usa as Netlify Functions (tanto em dev quanto em produção)
    return '/.netlify/functions/blog';
  }

  // Método auxiliar para fazer requisições HTTP
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
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
    const result = await this.makeRequest('articles', {
      method: 'POST',
      body: JSON.stringify(article)
    });
    console.log('📥 blogService.createArticle retornou:', result);
    return result;
  }

  async updateArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | null> {
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