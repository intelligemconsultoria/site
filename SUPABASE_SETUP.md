# Configuração do Supabase + Netlify Functions

## 🚀 Passos para Configurar

### 1. Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Aguarde a criação do banco de dados (pode levar alguns minutos)

### 2. Configurar Banco de Dados

1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute o SQL do arquivo `supabase/schema.sql`
3. Isso criará as tabelas, índices e dados iniciais

### 3. Obter Credenciais

1. No dashboard do Supabase, vá para **Settings** > **API**
2. Copie:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)

### 4. Configurar Variáveis de Ambiente

#### No Netlify Dashboard:
1. Vá para **Site settings** > **Environment variables**
2. Adicione as variáveis:
   - `SUPABASE_URL` = sua URL do projeto
   - `SUPABASE_ANON_KEY` = sua chave anônima

#### Para Desenvolvimento Local:
```bash
# Windows (PowerShell)
$env:SUPABASE_URL="sua_url_do_supabase"
$env:SUPABASE_ANON_KEY="sua_chave_anonima"

# Linux/Mac
export SUPABASE_URL=sua_url_do_supabase
export SUPABASE_ANON_KEY=sua_chave_anonima
```

### 5. Inicializar Dados

```bash
# Execute o script de inicialização
npm run init:supabase
```

### 6. Testar Localmente

```bash
# Instalar Netlify CLI (se ainda não instalado)
npm install -g netlify-cli

# Fazer login no Netlify
netlify login

# Executar em modo de desenvolvimento
npm run netlify:dev
```

### 7. Deploy para Produção

```bash
# Deploy para produção
npm run deploy
```

## 📁 Estrutura Criada

### Tabelas Supabase:
- `articles` - Artigos do blog
- `subscribers` - Assinantes do newsletter

### Índices Criados:
- `idx_articles_published` - Artigos publicados
- `idx_articles_featured` - Artigos em destaque
- `idx_articles_category` - Filtro por categoria
- `idx_articles_slug` - Busca por slug (único)
- `idx_articles_created_at` - Ordenação por data
- `idx_subscribers_email` - Busca por email
- `idx_subscribers_active` - Assinantes ativos

### Políticas de Segurança (RLS):
- **Artigos**: Todos podem ler artigos publicados
- **Newsletter**: Qualquer um pode se inscrever
- **Admin**: Usuários autenticados podem gerenciar conteúdo

## 🔧 Endpoints da API

### Artigos
- `GET /.netlify/functions/blog/articles` - Todos os artigos
- `GET /.netlify/functions/blog/published` - Artigos publicados
- `GET /.netlify/functions/blog/featured` - Artigos em destaque
- `GET /.netlify/functions/blog/{slug}` - Artigo por slug
- `GET /.netlify/functions/blog/categories` - Lista de categorias
- `POST /.netlify/functions/blog/articles` - Criar artigo
- `PUT /.netlify/functions/blog/articles/{id}` - Atualizar artigo
- `DELETE /.netlify/functions/blog/articles/{id}` - Deletar artigo

### Busca e Filtros
- `POST /.netlify/functions/blog/search` - Buscar artigos
- `POST /.netlify/functions/blog/filter` - Filtrar por categoria

### Newsletter
- `POST /.netlify/functions/blog/subscribe` - Inscrever no newsletter
- `GET /.netlify/functions/blog/subscribers` - Listar assinantes
- `DELETE /.netlify/functions/blog/unsubscribe/{email}` - Descadastrar

### Estatísticas
- `GET /.netlify/functions/blog/stats` - Estatísticas do blog

## 🚨 Troubleshooting

### Erro: "SUPABASE_URL não encontrado"
- Verifique se as variáveis estão configuradas no Netlify
- Para desenvolvimento local, configure as variáveis de ambiente

### Erro: "relation 'articles' does not exist"
- Execute o SQL do `supabase/schema.sql` no Supabase Dashboard
- Verifique se o projeto foi criado corretamente

### Erro: "permission denied"
- Verifique as políticas RLS no Supabase
- Certifique-se de que as políticas estão habilitadas

### Erro: "Function not found"
- Verifique se está executando com `npm run netlify:dev`
- Para produção, certifique-se de que as funções estão deployadas

## 📊 Dados Iniciais

O script cria 3 artigos de exemplo:
1. "O Futuro da Análise de Dados: Tendências para 2025" (em destaque)
2. "IA Generativa nos Negócios: Além do Hype"
3. "Automação Inteligente: ROI e Implementação"

## 🎯 Vantagens do Supabase

1. **PostgreSQL**: Banco relacional robusto e confiável
2. **API REST**: Endpoints automáticos para todas as tabelas
3. **Dashboard Visual**: Interface para gerenciar dados
4. **RLS**: Row Level Security para controle de acesso
5. **Real-time**: Atualizações em tempo real (opcional)
6. **Autenticação**: Sistema de usuários integrado (opcional)
7. **Storage**: Armazenamento de arquivos (opcional)

## 🔄 Migração de Dados

Se você já tem dados em outro sistema:

1. Exporte seus dados existentes
2. Adapte o formato para o schema do Supabase
3. Use o SQL Editor para inserir os dados
4. Ou crie um script personalizado de migração

## 📚 Próximos Passos

1. Configure sua conta Supabase
2. Execute o schema SQL
3. Configure as variáveis de ambiente
4. Execute o script de inicialização
5. Teste localmente
6. Faça deploy para produção
7. Configure autenticação (opcional)
8. Adicione mais funcionalidades conforme necessário

## 💡 Dicas Úteis

- Use o **SQL Editor** do Supabase para consultas complexas
- Monitore o uso através do dashboard
- Configure backups automáticos
- Use **Database Functions** para lógica complexa
- Explore **Edge Functions** para funcionalidades avançadas
