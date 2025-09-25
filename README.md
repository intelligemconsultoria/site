
# 🚀 IntelliGem Website

Uma interface web moderna e profissional para a empresa IntelliGem, especializada em soluções de dados, automação e inteligência artificial.

## ✨ Características

- **Design Moderno**: Interface dark com gradientes sofisticados
- **Responsivo**: Totalmente adaptável para mobile e desktop
- **Blog Completo**: Sistema de artigos com CRUD e categorias
- **Painel Admin**: Interface para gerenciar conteúdo
- **Performance**: Otimizado com Vite e SWC
- **Acessível**: Componentes Radix UI para melhor acessibilidade

## 🛠️ Tecnologias

- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5 com SWC
- **Styling**: Tailwind CSS 4.1.3
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: Sonner

### Backend
- **Netlify Functions**: Serverless functions
- **Supabase**: Banco de dados PostgreSQL serverless
- **Node.js**: Runtime para as funções

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Netlify

### 1. Instalação
```bash
# Clone o repositório
git clone https://github.com/[seu-usuario]/site.git

# Entre no diretório
cd site

# Instale as dependências
npm install
```

### 2. Configuração do Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o SQL do arquivo `supabase/schema.sql` no SQL Editor
4. Obtenha suas credenciais (URL e chave anônima)

### 3. Configurar Variáveis de Ambiente
No Netlify Dashboard:
- `SUPABASE_URL` = sua URL do projeto
- `SUPABASE_ANON_KEY` = sua chave anônima

### 4. Inicializar Dados
```bash
# Configure localmente (apenas para inicialização)
export SUPABASE_URL=sua_url_do_supabase
export SUPABASE_ANON_KEY=sua_chave_anonima

# Execute o script de inicialização
npm run init:supabase
```

### 5. Desenvolvimento Local
```bash
# Modo de desenvolvimento padrão
npm run dev

# Modo de desenvolvimento com Netlify Functions
npm run netlify:dev
```

O projeto estará disponível em `http://localhost:3000`

## 🔧 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento com Vite
npm run build            # Build para produção
npm run netlify:dev      # Desenvolvimento com Netlify Functions
npm run netlify:build    # Build com Netlify
npm run init:supabase    # Inicializar banco de dados
npm run deploy           # Deploy para produção
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Sistema de design (Radix UI)
│   ├── figma/          # Componentes específicos do Figma
│   └── [sections]      # Seções da landing page
├── services/           # Lógica de negócio
├── hooks/              # Custom hooks
├── assets/             # Imagens e recursos
└── styles/             # Configurações de estilo
```

## 🎨 Design System

### Paleta de Cores
- **Preto Principal**: `#030405` (IntelliGem Black)
- **Verde Esmeralda**: `#31af9d` (IntelliGem Emerald) - Cor primária
- **Azul Safira**: `#136eae` (IntelliGem Sapphire) - Cor secundária
- **Roxo Ametista**: `#512f82` (IntelliGem Amethyst) - Cor de destaque
- **Azul Profundo**: `#1b3f82` (IntelliGem Deep Blue)

## 📝 Funcionalidades

### Landing Page
- Header com navegação fixa
- Hero section com gradientes
- Seções: Sobre, Soluções, Cases, Blog, CTA
- Footer completo

### Sistema de Blog
- CRUD completo de artigos
- Sistema de categorias e tags
- Busca por conteúdo
- Artigos em destaque
- Newsletter subscription

### Painel Administrativo
- Interface para gerenciar artigos
- Estatísticas do blog
- Gerenciamento de newsletter

## 🚨 Troubleshooting

### Erro: "SUPABASE_URL não encontrado"
- Verifique se as variáveis estão configuradas no Netlify
- Para desenvolvimento local: `export SUPABASE_URL=sua_url`

### Erro: "relation 'articles' does not exist"
- Execute o SQL do `supabase/schema.sql` no Supabase Dashboard

### Erro: "Function not found"
- Verifique se está executando com `npm run netlify:dev`
- Para produção, certifique-se de que as funções estão deployadas

## 📚 Documentação Adicional

- [Configuração do Supabase](SUPABASE_SETUP.md) - Guia detalhado de configuração

## 🚀 Deploy

O projeto está configurado para deploy em:
- **Netlify**: `npm run build` e deploy da pasta `dist` (configuração automática via `netlify.toml`)
- **Vercel**: Deploy automático via GitHub
- **GitHub Pages**: Configuração manual necessária

## 📄 Licença

Este projeto é propriedade da IntelliGem. Todos os direitos reservados.

## 🤝 Contribuição

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Contato

- **Website**: [IntelliGem](https://intelligem.com)
- **Email**: contato@intelligem.com
- **LinkedIn**: [IntelliGem](https://linkedin.com/company/intelligem)
  