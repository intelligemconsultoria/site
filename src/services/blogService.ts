// Blog Service - Simula um backend que pode ser migrado para Netlify Functions
export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  published: boolean;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

class BlogService {
  private storageKey = 'intelligem_blog_articles';
  private newsletterKey = 'intelligem_newsletter_subscribers';

  // Inicializar com dados padrão
  private initializeDefaultData() {
    const articles: BlogArticle[] = [
      {
        id: '1',
        title: 'O Futuro da Análise de Dados: Tendências para 2025',
        excerpt: 'Explore as principais tendências que moldarão o cenário de dados nos próximos anos, desde IA generativa até automação inteligente.',
        content: `
# O Futuro da Análise de Dados: Tendências para 2025

A análise de dados está evoluindo rapidamente, impulsionada por avanços em inteligência artificial e automação. Neste artigo, exploramos as principais tendências que definirão o futuro dos dados nos próximos anos.

## 1. Democratização da Análise de Dados

A democratização dos dados continuará sendo uma tendência dominante em 2025. Ferramentas de self-service analytics estão se tornando mais intuitivas, permitindo que usuários não-técnicos realizem análises complexas.

### Principais características:
- Interfaces drag-and-drop mais sofisticadas
- Processamento de linguagem natural para consultas
- Automação de insights e alertas

## 2. IA Generativa na Análise

A integração da IA generativa está transformando como analisamos e interpretamos dados:

- **Geração automática de relatórios**: IA que cria narrativas a partir dos dados
- **Insights preditivos**: Modelos que antecipam tendências futuras
- **Análise de sentimentos avançada**: Compreensão mais profunda de dados não estruturados

## 3. Edge Analytics

O processamento de dados no edge está ganhando tração, especialmente para IoT e aplicações em tempo real.

## Conclusão

O futuro da análise de dados será caracterizado pela democratização, automação e inteligência artificial integrada. As empresas que se adaptarem a essas tendências terão vantagem competitiva significativa.
        `,
        author: 'Equipe IntelliGem',
        date: '15 Jan 2025',
        readTime: '8 min',
        category: 'Tendências',
        image: 'https://images.unsplash.com/photo-1740908900846-4bbd4f22c975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGJsb2d8ZW58MXx8fHwxNzU4NTc5NzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        featured: true,
        published: true,
        slug: 'futuro-analise-dados-2025',
        tags: ['dados', 'ia', 'tendências', 'automação'],
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'IA Generativa nos Negócios: Além do Hype',
        excerpt: 'Como empresas estão realmente aplicando IA generativa para resolver problemas concretos e gerar valor mensurável.',
        content: `
# IA Generativa nos Negócios: Além do Hype

A inteligência artificial generativa tem sido amplamente discutida, mas poucas empresas conseguem aplicá-la efetivamente para gerar valor real.

## Casos de Uso Práticos

### 1. Automação de Conteúdo
- Geração de relatórios automatizados
- Criação de documentação técnica
- Personalização de comunicações

### 2. Análise de Dados
- Interpretação automática de dashboards
- Geração de insights narrativos
- Identificação de anomalias

### 3. Suporte ao Cliente
- Chatbots mais inteligentes
- Análise de sentimentos em tempo real
- Personalização de atendimento

## ROI Mensurável

As empresas que implementaram IA generativa de forma estratégica reportam:
- 30% de redução no tempo de análise
- 45% de melhoria na qualidade dos insights
- 25% de aumento na satisfação do cliente

## Implementação Bem-Sucedida

Para uma implementação bem-sucedida, considere:
1. Definir casos de uso específicos
2. Começar com projetos piloto
3. Investir em treinamento da equipe
4. Estabelecer métricas claras de sucesso
        `,
        author: 'Dr. Ana Silva',
        date: '10 Jan 2025',
        readTime: '12 min',
        category: 'Inteligência Artificial',
        image: 'https://images.unsplash.com/photo-1674027215001-9210851de177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZnV0dXJlfGVufDF8fHx8MTc1ODU0NzQyMnww&ixlib=rb-4.1.0&q=80&w=1080',
        featured: false,
        published: true,
        slug: 'ia-generativa-negocios',
        tags: ['ia', 'negócios', 'roi', 'implementação'],
        createdAt: '2025-01-10T14:30:00Z',
        updatedAt: '2025-01-10T14:30:00Z'
      },
      {
        id: '3',
        title: 'Automação Inteligente: ROI e Implementação',
        excerpt: 'Guia prático para calcular o retorno de investimento em automação e as melhores práticas de implementação.',
        content: `
# Automação Inteligente: ROI e Implementação

A automação inteligente promete transformar processos empresariais, mas como medir seu real impacto e implementá-la efetivamente?

## Calculando o ROI

### Métricas Principais
- **Tempo economizado**: Horas de trabalho manual reduzidas
- **Redução de erros**: Diminuição de retrabalho e correções
- **Custos operacionais**: Economia em recursos humanos e infraestrutura
- **Aumento de produtividade**: Mais tarefas executadas no mesmo tempo

### Fórmula do ROI
\`\`\`
ROI = (Benefícios - Custos) / Custos × 100
\`\`\`

## Fases de Implementação

### 1. Avaliação e Planejamento
- Mapeamento de processos atuais
- Identificação de gargalos
- Análise de viabilidade técnica

### 2. Projeto Piloto
- Seleção de processo de baixo risco
- Implementação controlada
- Medição de resultados

### 3. Escalonamento
- Expansão para outros processos
- Otimização contínua
- Treinamento da equipe

## Melhores Práticas

1. **Comece pequeno**: Escolha processos simples e repetitivos
2. **Envolva as equipes**: Garanta buy-in dos usuários finais
3. **Monitore continuamente**: Estabeleça KPIs claros
4. **Seja flexível**: Adapte a solução conforme necessário

## Resultados Esperados

Empresas que implementam automação inteligente tipicamente observam:
- 40-60% de redução no tempo de execução
- 25-35% de diminuição de erros
- ROI positivo em 6-12 meses
        `,
        author: 'Carlos Roberto',
        date: '05 Jan 2025',
        readTime: '6 min',
        category: 'Automação',
        image: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjB0cmVuZHN8ZW58MXx8fHwxNzU4NTc5Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        featured: false,
        published: true,
        slug: 'automacao-inteligente-roi',
        tags: ['automação', 'roi', 'implementação', 'processos'],
        createdAt: '2025-01-05T09:15:00Z',
        updatedAt: '2025-01-05T09:15:00Z'
      }
    ];

    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(articles));
    }
  }

  // Métodos para artigos
  async getAllArticles(): Promise<BlogArticle[]> {
    this.initializeDefaultData();
    const articles = localStorage.getItem(this.storageKey);
    return articles ? JSON.parse(articles) : [];
  }

  async getPublishedArticles(): Promise<BlogArticle[]> {
    const articles = await this.getAllArticles();
    return articles.filter(article => article.published);
  }

  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    const articles = await this.getAllArticles();
    return articles.find(article => article.slug === slug) || null;
  }

  async getArticlesByCategory(category: string): Promise<BlogArticle[]> {
    const articles = await this.getPublishedArticles();
    return category === 'Todos' 
      ? articles 
      : articles.filter(article => article.category === category);
  }

  async searchArticles(query: string): Promise<BlogArticle[]> {
    const articles = await this.getPublishedArticles();
    const lowercaseQuery = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getFeaturedArticles(): Promise<BlogArticle[]> {
    const articles = await this.getPublishedArticles();
    return articles.filter(article => article.featured);
  }

  async createArticle(article: Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogArticle> {
    const articles = await this.getAllArticles();
    const newArticle: BlogArticle = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    articles.push(newArticle);
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
    return newArticle;
  }

  async updateArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | null> {
    const articles = await this.getAllArticles();
    const index = articles.findIndex(article => article.id === id);
    
    if (index === -1) return null;
    
    articles[index] = {
      ...articles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(articles));
    return articles[index];
  }

  async deleteArticle(id: string): Promise<boolean> {
    const articles = await this.getAllArticles();
    const filteredArticles = articles.filter(article => article.id !== id);
    
    if (filteredArticles.length === articles.length) return false;
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredArticles));
    return true;
  }

  // Métodos para newsletter
  async subscribeToNewsletter(email: string): Promise<boolean> {
    try {
      const subscribers = await this.getNewsletterSubscribers();
      
      // Verificar se já existe
      if (subscribers.some(sub => sub.email === email)) {
        throw new Error('Email já cadastrado');
      }
      
      const newSubscriber: NewsletterSubscriber = {
        id: Date.now().toString(),
        email,
        subscribedAt: new Date().toISOString(),
        active: true
      };
      
      subscribers.push(newSubscriber);
      localStorage.setItem(this.newsletterKey, JSON.stringify(subscribers));
      return true;
    } catch (error) {
      console.error('Erro ao inscrever no newsletter:', error);
      return false;
    }
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const subscribers = localStorage.getItem(this.newsletterKey);
    return subscribers ? JSON.parse(subscribers) : [];
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    try {
      const subscribers = await this.getNewsletterSubscribers();
      const updatedSubscribers = subscribers.map(sub => 
        sub.email === email ? { ...sub, active: false } : sub
      );
      
      localStorage.setItem(this.newsletterKey, JSON.stringify(updatedSubscribers));
      return true;
    } catch (error) {
      console.error('Erro ao descadastrar do newsletter:', error);
      return false;
    }
  }

  // Método para obter categorias únicas
  async getCategories(): Promise<string[]> {
    const articles = await this.getPublishedArticles();
    const categories = articles.map(article => article.category);
    return [...new Set(categories)];
  }

  // Método para obter estatísticas
  async getStats() {
    const articles = await this.getAllArticles();
    const subscribers = await this.getNewsletterSubscribers();
    
    return {
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.published).length,
      draftArticles: articles.filter(a => !a.published).length,
      featuredArticles: articles.filter(a => a.featured).length,
      totalSubscribers: subscribers.filter(s => s.active).length,
      categories: await this.getCategories()
    };
  }
}

export const blogService = new BlogService();