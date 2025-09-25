# 🔒 Guia de Segurança - IntelliGem

## ⚠️ IMPORTANTE: Configuração de Segurança

### 🚨 Problema Identificado
A senha de administração estava exposta no código frontend, o que é uma **vulnerabilidade crítica de segurança**.

### ✅ Solução Implementada
- **Variáveis de ambiente** para senhas sensíveis
- **Fallback seguro** para desenvolvimento
- **Documentação** de boas práticas

## 🛠️ Configuração de Variáveis de Ambiente

### 1. Criar arquivo `.env.local` (não commitado)
```bash
# .env.local
VITE_ADMIN_PASSWORD=sua-senha-super-secreta-aqui
```

### 2. Adicionar ao `.gitignore`
```bash
# .gitignore
.env.local
.env.production
```

### 3. Configurar no Netlify (Produção)
- Acesse: Netlify Dashboard → Site Settings → Environment Variables
- Adicione: `VITE_ADMIN_PASSWORD` = sua senha secreta

## 🔐 Boas Práticas de Segurança

### ❌ NUNCA FAÇA:
- Hardcode de senhas no código
- Commitar arquivos `.env.local`
- Expor credenciais no frontend
- Usar senhas simples em produção

### ✅ SEMPRE FAÇA:
- Use variáveis de ambiente
- Senhas complexas (16+ caracteres)
- Rotação regular de credenciais
- Autenticação backend quando possível

## 🚀 Implementação Supabase Auth (CONCLUÍDA!)

### ✅ Funcionalidades Implementadas:
1. **Supabase Auth** com email/senha real
2. **Autenticação profissional** com JWT tokens
3. **Verificação de permissões** de admin
4. **Sessões seguras** com expiração automática
5. **Logout seguro** com limpeza de dados

### 🛠️ Como Usar:

#### 1. Criar Usuário Admin:
```bash
npm run create:admin
```

#### 2. Configurar Variáveis de Ambiente:
```bash
# .env.local
VITE_SUPABASE_URL=https://abfowubusomlibuihqrz.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

#### 3. Acessar Admin:
- URL: `https://siteintelligem.netlify.app/admin`
- Email: `admin@intelligem.com.br`
- Senha: `IntelliGem2025!`
- **Status**: ✅ Usuário criado com sucesso!
- **User ID**: `4b54f170-d282-4d6c-93b1-0bf2b2517c69`

### 🔐 Recursos de Segurança:
- ✅ **Autenticação real** via Supabase
- ✅ **Verificação de email** obrigatória
- ✅ **Sessões JWT** seguras
- ✅ **Logout automático** em caso de erro
- ✅ **Mensagens de erro** em português
- ✅ **Validação de campos** obrigatórios

## 📞 Suporte
Para dúvidas sobre segurança, consulte a documentação do Supabase ou contate a equipe de desenvolvimento.
