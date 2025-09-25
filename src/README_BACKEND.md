# Backend do Blog IntelliGem

Este documento explica como funciona o sistema de backend do blog da IntelliGem e como migrar para Netlify Functions.

## Funcionalidades Implementadas

### 1. Gerenciamento de Artigos
- ✅ Criar novos artigos
- ✅ Editar artigos existentes
- ✅ Excluir artigos
- ✅ Publicar/despublicar artigos
- ✅ Marcar artigos como destaque
- ✅ Pesquisa por título, conteúdo e tags
- ✅ Filtros por categoria

### 2. Sistema de Newsletter
- ✅ Inscrição de e-mails
- ✅ Validação de e-mails duplicados
- ✅ Gerenciamento de assinantes

### 3. Interface Administrativa
- ✅ Dashboard com estatísticas
- ✅ Formulário de criação/edição de artigos
- ✅ Lista de todos os artigos
- ✅ Controle de publicação

## Como Usar

### Desenvolvimento Local
O sistema atual utiliza localStorage para simular um banco de dados. Todos os dados são persistidos no navegador.

### Acessar Administração
- Faça um duplo clique no logo da IntelliGem no header
- Isso abrirá a interface de administração

### Funcionalidades da Administração
1. **Criar Artigo**: Clique em "Novo Artigo"
2. **Editar Artigo**: Clique no ícone de edição ao lado do artigo
3. **Publicar/Despublicar**: Clique no ícone de olho
4. **Excluir**: Clique no ícone de lixeira
5. **Ver Estatísticas**: Aba "Estatísticas"

## Migração para Netlify Functions

Para migrar este sistema para o Netlify em produção, siga estes passos:

### 1. Criar Netlify Functions

Crie os seguintes arquivos na pasta `netlify/functions/`:

```javascript
// netlify/functions/blog-articles.js
exports.handler = async (event, context) => {
  const { httpMethod, path, body } = event;
  
  // Aqui você conectaria com um banco de dados real
  // Como Supabase, MongoDB, ou PostgreSQL
  
  switch (httpMethod) {
    case 'GET':
      // Retornar artigos
      break;
    case 'POST':
      // Criar novo artigo
      break;
    case 'PUT':
      // Atualizar artigo
      break;
    case 'DELETE':
      // Deletar artigo
      break;
  }
};
```

### 2. Atualizar o BlogService

Substitua as chamadas localStorage por fetch para as Netlify Functions:

```typescript
// services/blogService.ts (versão produção)
async getAllArticles(): Promise<BlogArticle[]> {
  const response = await fetch('/.netlify/functions/blog-articles');
  return await response.json();
}

async createArticle(article: Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogArticle> {
  const response = await fetch('/.netlify/functions/blog-articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article)
  });
  return await response.json();
}
```

### 3. Banco de Dados Recomendado

Para produção, recomendamos usar **Supabase** com as seguintes tabelas:

```sql
-- Tabela de artigos
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinantes da newsletter
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Variáveis de Ambiente

Configure as seguintes variáveis no Netlify:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Funcionalidades Futuras

### Próximas Implementações
- [ ] Sistema de comentários
- [ ] Analytics de visualizações
- [ ] SEO otimizado por artigo
- [ ] Sistema de tags mais avançado
- [ ] Upload de imagens
- [ ] Editor WYSIWYG
- [ ] Versionamento de artigos
- [ ] Agendamento de publicações

### Melhorias de Performance
- [ ] Cache de artigos
- [ ] Paginação
- [ ] Lazy loading de imagens
- [ ] CDN para assets

## Estrutura de Dados

### BlogArticle Interface
```typescript
interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
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
```

### NewsletterSubscriber Interface
```typescript
interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}
```

## Segurança

### Considerações Importantes
- ✅ Validação de entrada de dados
- ✅ Sanitização de conteúdo HTML
- ❌ Autenticação de administrador (a implementar)
- ❌ Rate limiting (a implementar)
- ❌ CORS configurado (a implementar)

### Para Produção
1. Implementar autenticação JWT
2. Configurar CORS adequadamente
3. Adicionar rate limiting
4. Implementar logs de auditoria
5. Backup automático de dados

## Suporte

Para dúvidas sobre implementação ou migração, consulte:
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query para cache](https://tanstack.com/query/latest/docs/react/overview)