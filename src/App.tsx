import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { SolutionsSection } from "./components/SolutionsSection";
import { CasesSection } from "./components/CasesSection";
import { BlogSection } from "./components/BlogSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import { BlogPage } from "./components/BlogPage";
import { BlogAdmin } from "./components/BlogAdmin";
import { ArticlePage } from "./components/ArticlePage";
import { ArticleEditor } from "./components/ArticleEditor";
import { AdminLogin } from "./components/AdminLogin";
import { ResetPassword } from "./components/ResetPassword";
import { Toaster } from "./components/ui/sonner";
import { authService } from "./services/authService";
import { blogService, BlogArticle } from "./services/blogService";

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Função para obter a página atual baseada na URL
  const getCurrentPageFromURL = () => {
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    console.log('🔍 [ROUTING] Analisando URL:', { path, search, hash });
    
    // Verificar se há tokens de reset de senha na URL
    const hasResetTokens = search.includes('access_token') || 
                         hash.includes('access_token') || 
                         window.location.href.includes('access_token') ||
                         window.location.href.includes('refresh_token');
    
    if (hasResetTokens) {
      return { page: 'reset-password', slug: '' };
    }
    
    // Roteamento baseado em path
    if (path === '/admin') {
      const urlParams = new URLSearchParams(search);
      const editorMode = urlParams.get('editor');
      
      if (editorMode === 'new' || editorMode === 'edit') {
        return { page: 'admin-editor', slug: '' };
      }
      return { page: 'admin', slug: '' };
    }
    
    if (path === '/admin-login') {
      return { page: 'admin-login', slug: '' };
    }
    
    if (path === '/blog') {
      return { page: 'blog', slug: '' };
    }
    
    if (path.startsWith('/article/')) {
      const slug = path.replace('/article/', '');
      return { page: 'article', slug };
    }
    
    // Página inicial por padrão
    return { page: 'home', slug: '' };
  };

  // Função para navegar atualizando a URL
  const navigateToBlog = () => {
    window.history.pushState({}, '', '/blog');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  const navigateToArticle = (slug: string) => {
    console.log('🔗 [NAVIGATION] Navegando para artigo:', slug);
    window.history.pushState({}, '', `/article/${slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  const navigateToEditor = () => {
    window.history.pushState({}, '', '/admin?editor=new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'admin' | 'article' | 'admin-login' | 'reset-password' | 'admin-editor'>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');

  // Monitor mudanças na página atual
  useEffect(() => {
    console.log('📄 [PAGE CHANGE] currentPage mudou para:', currentPage);
    console.log('📄 [PAGE CHANGE] Stack trace:', new Error().stack);
  }, [currentPage]);

  // Função para atualizar a página baseada na URL
  const updatePageFromURL = () => {
    const { page, slug } = getCurrentPageFromURL();
    console.log('🔄 [ROUTING] Atualizando página:', { page, slug });
    console.log('🔄 [ROUTING] URL atual:', window.location.href);
    setCurrentPage(page);
    setCurrentArticleSlug(slug);
  };

  // Verificar autenticação e rota ao carregar a página
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 [APP] Inicializando app...');
        console.log('📍 [APP] URL atual:', window.location.href);
        console.log('🕐 [APP] Timestamp:', new Date().toISOString());
        
        // Primeiro verificar autenticação
        console.log('🔐 [APP] Verificando autenticação...');
        const hasActiveSession = await authService.checkSession();
        console.log('🔐 [APP] Sessão ativa:', hasActiveSession);
        setIsAdminAuthenticated(hasActiveSession);
        
        // Depois detectar rota baseada na URL
        updatePageFromURL();
        
      } catch (error) {
        console.error('❌ Erro ao inicializar app:', error);
        setIsAdminAuthenticated(false);
      }
    };

    initializeApp();
  }, []);

  // Escutar mudanças na URL (botão voltar/avançar do navegador)
  useEffect(() => {
    const handlePopState = () => {
      console.log('🔄 [ROUTING] PopState event - atualizando página');
      updatePageFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      navigateToAdmin();
    } else {
      // Para login, vamos usar uma URL especial
      window.history.pushState({}, '', '/admin-login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    navigateToAdmin();
  };

  const handleAdminLogout = async () => {
    try {
      await authService.signOut();
      setIsAdminAuthenticated(false);
      setCurrentPage('home');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar estado local
      setIsAdminAuthenticated(false);
      setCurrentPage('home');
    }
  };

  if (currentPage === 'blog') {
    return (
      <>
        <BlogPage onBack={navigateToHome} onNavigateToArticle={navigateToArticle} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'article') {
    return (
      <>
        <ArticlePage slug={currentArticleSlug} onBack={navigateToBlog} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'admin-login') {
    return (
      <>
        <AdminLogin onLogin={handleAdminLogin} onCancel={navigateToHome} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'reset-password') {
    return (
      <>
        <ResetPassword onBack={navigateToHome} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'admin') {
    return (
      <>
        <BlogAdmin onBack={navigateToHome} onLogout={handleAdminLogout} onNavigateToEditor={navigateToEditor} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'article') {
    return (
      <>
        <ArticlePage slug={currentArticleSlug} onBack={navigateToBlog} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'blog') {
    return (
      <>
        <BlogPage onNavigateToHome={navigateToHome} onNavigateToArticle={navigateToArticle} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'admin-editor') {
    return (
      <>
        <ArticleEditor 
          article={null} 
          onSave={async (articleData: Partial<BlogArticle>, isPublish: boolean = false) => {
            try {
              console.log('🔄 onSave chamado:', { isPublish, articleData: { title: articleData.title, published: articleData.published, id: articleData.id } });
              
              let result: BlogArticle;
              
              // Se tem ID, é um artigo existente - usar updateArticle
              if (articleData.id) {
                console.log('📝 Atualizando artigo existente:', articleData.id);
                result = await blogService.updateArticle(articleData.id, articleData) as BlogArticle;
              } else {
                console.log('🆕 Criando novo artigo');
                result = await blogService.createArticle(articleData);
              }
              
              console.log('✅ Artigo salvo com sucesso:', result);
              
              if (isPublish) {
                console.log('📤 Publicação detectada - redirecionando para admin');
                // Para publicação, redirecionar após salvar
                window.history.replaceState({}, '', '/admin');
                setCurrentPage('admin');
              } else {
                console.log('💾 Autosave - NÃO redirecionando');
              }
              
              return result; // Retornar o artigo criado/atualizado para capturar o ID
            } catch (error) {
              console.error('❌ Erro ao salvar artigo:', error);
              throw error; // Re-throw para o ArticleEditor mostrar o erro
            }
          }} 
          onCancel={() => {
            // Limpar parâmetros da URL e voltar para admin
            window.history.replaceState({}, '', '/admin');
            setCurrentPage('admin');
          }} 
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <Header />
        <HeroSection />
        <AboutSection />
        <SolutionsSection />
        <CasesSection />
        <BlogSection onNavigateToBlog={navigateToBlog} onNavigateToArticle={navigateToArticle} />
        <CTASection />
        <Footer />
      </div>
      <Toaster />
    </>
  );
}