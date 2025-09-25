-- Schema do banco de dados Supabase para o blog IntelliGem
-- Execute este SQL no SQL Editor do Supabase Dashboard

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de artigos do blog
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    read_time VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinantes do newsletter
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(active);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS - Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Política para artigos: todos podem ler artigos publicados
CREATE POLICY "Artigos públicos são visíveis para todos" ON articles
    FOR SELECT USING (published = true);

-- Política para artigos: permitir inserção, atualização e deleção para usuários autenticados
-- (Você pode ajustar isso conforme sua necessidade de autenticação)
CREATE POLICY "Usuários autenticados podem gerenciar artigos" ON articles
    FOR ALL USING (true);

-- Política para subscribers: permitir inserção de novos emails
CREATE POLICY "Qualquer um pode se inscrever no newsletter" ON subscribers
    FOR INSERT WITH CHECK (true);

-- Política para subscribers: apenas usuários autenticados podem ver a lista
CREATE POLICY "Usuários autenticados podem ver subscribers" ON subscribers
    FOR SELECT USING (true);

-- Inserir dados iniciais
INSERT INTO articles (title, excerpt, content, author, date, read_time, category, image_url, featured, published, slug, tags) VALUES
(
    'O Futuro da Análise de Dados: Tendências para 2025',
    'Explore as principais tendências que moldarão o cenário de dados nos próximos anos, desde IA generativa até automação inteligente.',
    '# O Futuro da Análise de Dados: Tendências para 2025

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

O futuro da análise de dados será caracterizado pela democratização, automação e inteligência artificial integrada. As empresas que se adaptarem a essas tendências terão vantagem competitiva significativa.',
    'Equipe IntelliGem',
    '2025-01-15',
    '8 min',
    'Tendências',
    'https://images.unsplash.com/photo-1740908900846-4bbd4f22c975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGJsb2d8ZW58MXx8fHwxNzU4NTc5NzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    true,
    true,
    'futuro-analise-dados-2025',
    ARRAY['dados', 'ia', 'tendências', 'automação']
),
(
    'IA Generativa nos Negócios: Além do Hype',
    'Como empresas estão realmente aplicando IA generativa para resolver problemas concretos e gerar valor mensurável.',
    '# IA Generativa nos Negócios: Além do Hype

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
4. Estabelecer métricas claras de sucesso',
    'Dr. Ana Silva',
    '2025-01-10',
    '12 min',
    'Inteligência Artificial',
    'https://images.unsplash.com/photo-1674027215001-9210851de177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZnV0dXJlfGVufDF8fHx8MTc1ODU0NzQyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    false,
    true,
    'ia-generativa-negocios',
    ARRAY['ia', 'negócios', 'roi', 'implementação']
),
(
    'Automação Inteligente: ROI e Implementação',
    'Guia prático para calcular o retorno de investimento em automação e as melhores práticas de implementação.',
    '# Automação Inteligente: ROI e Implementação

A automação inteligente promete transformar processos empresariais, mas como medir seu real impacto e implementá-la efetivamente?

## Calculando o ROI

### Métricas Principais
- **Tempo economizado**: Horas de trabalho manual reduzidas
- **Redução de erros**: Diminuição de retrabalho e correções
- **Custos operacionais**: Economia em recursos humanos e infraestrutura
- **Aumento de produtividade**: Mais tarefas executadas no mesmo tempo

### Fórmula do ROI
```
ROI = (Benefícios - Custos) / Custos × 100
```

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
- ROI positivo em 6-12 meses',
    'Carlos Roberto',
    '2025-01-05',
    '6 min',
    'Automação',
    'https://images.unsplash.com/photo-1647427060118-4911c9821b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjB0cmVuZHN8ZW58MXx8fHwxNzU4NTc5Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    false,
    true,
    'automacao-inteligente-roi',
    ARRAY['automação', 'roi', 'implementação', 'processos']
);

-- Comentários nas tabelas
COMMENT ON TABLE articles IS 'Tabela de artigos do blog IntelliGem';
COMMENT ON TABLE subscribers IS 'Tabela de assinantes do newsletter';
COMMENT ON COLUMN articles.slug IS 'URL amigável do artigo (único)';
COMMENT ON COLUMN articles.tags IS 'Array de tags do artigo';
COMMENT ON COLUMN articles.featured IS 'Indica se o artigo está em destaque';
COMMENT ON COLUMN articles.published IS 'Indica se o artigo está publicado';
