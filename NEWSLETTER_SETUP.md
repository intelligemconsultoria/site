# 📧 Configuração da Tabela Newsletter

## 🚀 Como Criar a Tabela newsletter_subscribers

### Opção 1: Via Script Automático (Recomendado)

1. **Adicione a Service Role Key** ao arquivo `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

2. **Execute o script**:
```bash
npm run create:newsletter-table
```

### Opção 2: Via Supabase Dashboard (Manual)

1. **Acesse o Supabase Dashboard**: https://supabase.com/dashboard
2. **Vá para SQL Editor**
3. **Execute o SQL** do arquivo `scripts/create-newsletter-table.sql`

### Opção 3: Via Supabase CLI

```bash
supabase db reset
# ou
supabase migration new create_newsletter_table
```

## 📋 Estrutura da Tabela

```sql
newsletter_subscribers (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

## 🔒 Políticas de Segurança (RLS)

- ✅ **INSERT**: Qualquer um pode se inscrever
- ✅ **SELECT**: Apenas usuários autenticados
- ✅ **UPDATE**: Apenas usuários autenticados
- ✅ **DELETE**: Não permitido (soft delete via `active`)

## 🎯 Funcionalidades

- ✅ **Inscrição pública**: Qualquer um pode se inscrever
- ✅ **Email único**: Não permite duplicatas
- ✅ **Soft delete**: Desativa em vez de deletar
- ✅ **Timestamps automáticos**: `created_at` e `updated_at`
- ✅ **Índices otimizados**: Para busca rápida

## 🧪 Dados de Exemplo

Após criar a tabela, serão inseridos automaticamente:
- `exemplo@intelligem.com.br`
- `teste@intelligem.com.br`

## 🔍 Verificação

Após criar a tabela, verifique se está funcionando:

1. **Acesse o admin**: `http://localhost:3007/admin`
2. **Verifique as estatísticas**: Deve mostrar `totalSubscribers > 0`
3. **Console sem erros**: Não deve mais aparecer erro 404

## 🚨 Troubleshooting

### Erro: "Service Role Key não encontrada"
- Adicione `SUPABASE_SERVICE_ROLE_KEY` ao `.env.local`
- A Service Role Key está no Supabase Dashboard > Settings > API

### Erro: "Tabela já existe"
- Normal, o script usa `CREATE TABLE IF NOT EXISTS`
- Pode executar novamente sem problemas

### Erro: "Permissão negada"
- Verifique se está usando a Service Role Key (não a Anon Key)
- A Service Role Key tem permissões administrativas
