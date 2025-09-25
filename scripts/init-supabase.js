const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios');
  console.log('Configure as variáveis de ambiente:');
  console.log('export SUPABASE_URL=sua_url_do_supabase');
  console.log('export SUPABASE_ANON_KEY=sua_chave_anonima');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados iniciais para inserir
const initialArticles = [
  {
    title: 'O Futuro da Análise de Dados: Tendências para 2025',
    excerpt: 'Explore as principais tendências que moldarão o cenário de dados nos próximos anos, desde IA generativa até automação inteligente.',
    content: `# O Futuro da Análise de Dados: Tendências para 2025

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

O futuro da análise de dados será caracterizado pela democratização, automação e inteligência artificial integrada. As empresas que se adaptarem a essas tendências terão vantagem competitiva significativa.`,
    author: 'Equipe IntelliGem',
    date: '2025-01-15',
    read_time: '8 min',
    category: 'Tendências',
    image_url: 'https://images.unsplash.com/photo-1740908900846-4bbd4f22c975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGJsb2d8ZW58MXx8fHwxNzU4NTc5NzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    published: true,
    slug: 'futuro-analise-dados-2025',
    tags: ['dados', 'ia', 'tendências', 'automação']
  },
  {
    title: 'IA Generativa nos Negócios: Além do Hype',
    excerpt: 'Como empresas estão realmente aplicando IA generativa para resolver problemas concretos e gerar valor mensurável.',
    content: `# IA Generativa nos Negócios: Além do Hype

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
4. Estabelecer métricas claras de sucesso`,
    author: 'Dr. Ana Silva',
    date: '2025-01-10',
    read_time: '12 min',
    category: 'Inteligência Artificial',
    image_url: 'https://images.unsplash.com/photo-1674027215001-9210851de177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZnV0dXJlfGVufDF8fHx8MTc1ODU0NzQyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    published: true,
    slug: 'ia-generativa-negocios',
    tags: ['ia', 'negócios', 'roi', 'implementação']
  },
  {
    title: 'Automação Inteligente: ROI e Implementação',
    excerpt: 'Guia prático para calcular o retorno de investimento em automação e as melhores práticas de implementação.',
    content: `# Automação Inteligente: ROI e Implementação

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
- ROI positivo em 6-12 meses`,
    author: 'Carlos Roberto',
    date: '2025-01-05',
    read_time: '6 min',
    category: 'Automação',
    image_url: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjB0cmVuZHN8ZW58MXx8fHwxNzU4NTc5Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    published: true,
    slug: 'automacao-inteligente-roi',
    tags: ['automação', 'roi', 'implementação', 'processos']
  }
];

async function checkConnection() {
  try {
    console.log('🔍 Verificando conexão com Supabase...');
    const { data, error } = await supabase.from('articles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    return false;
  }
}

async function insertInitialArticles() {
  console.log('📝 Inserindo artigos iniciais...');
  
  for (const article of initialArticles) {
    try {
      // Verificar se o artigo já existe
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .single();
      
      if (existing) {
        console.log(`ℹ️ Artigo "${article.title}" já existe`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select();
      
      if (error) {
        console.error(`❌ Erro ao inserir "${article.title}":`, error.message);
        continue;
      }
      
      console.log(`✅ Artigo "${article.title}" inserido com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao inserir "${article.title}":`, error.message);
    }
  }
}

async function checkTables() {
  console.log('🔍 Verificando tabelas...');
  
  try {
    // Verificar tabela articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('count')
      .limit(1);
    
    if (articlesError) {
      console.error('❌ Tabela "articles" não encontrada:', articlesError.message);
      console.log('💡 Execute o SQL do schema.sql no Supabase Dashboard primeiro');
      return false;
    }
    
    console.log('✅ Tabela "articles" encontrada');
    
    // Verificar tabela subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('count')
      .limit(1);
    
    if (subscribersError) {
      console.error('❌ Tabela "subscribers" não encontrada:', subscribersError.message);
      console.log('💡 Execute o SQL do schema.sql no Supabase Dashboard primeiro');
      return false;
    }
    
    console.log('✅ Tabela "subscribers" encontrada');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error.message);
    return false;
  }
}

async function showStats() {
  console.log('📊 Estatísticas do banco de dados:');
  
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
    
    console.log(`📝 Total de artigos: ${totalArticles}`);
    console.log(`📰 Artigos publicados: ${publishedArticles}`);
    console.log(`⭐ Artigos em destaque: ${featuredArticles}`);
    console.log(`📧 Assinantes ativos: ${totalSubscribers}`);
    
    // Mostrar categorias
    const { data: categoriesData } = await supabase
      .from('articles')
      .select('category')
      .eq('published', true);
    
    const categories = [...new Set(categoriesData.map(item => item.category))];
    console.log(`🏷️ Categorias: ${categories.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Inicializando banco de dados Supabase...\n');
    
    // Verificar conexão
    const connected = await checkConnection();
    if (!connected) {
      process.exit(1);
    }
    
    console.log('');
    
    // Verificar tabelas
    const tablesExist = await checkTables();
    if (!tablesExist) {
      process.exit(1);
    }
    
    console.log('');
    
    // Inserir artigos iniciais
    await insertInitialArticles();
    
    console.log('');
    
    // Mostrar estatísticas
    await showStats();
    
    console.log('\n✅ Inicialização concluída com sucesso!');
    console.log('\n📚 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente no Netlify:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_ANON_KEY');
    console.log('2. Execute: npm run netlify:dev');
    console.log('3. Teste a API em: http://localhost:8888/.netlify/functions/blog/articles');
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error.message);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main };
