
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

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/[seu-usuario]/site.git

# Entre no diretório
cd site

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

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
  