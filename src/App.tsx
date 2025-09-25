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
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'admin' | 'article' | 'admin-login' | 'reset-password' | 'admin-editor'>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const navigateToBlog = () => setCurrentPage('blog');
  const navigateToHome = () => setCurrentPage('home');
  const navigateToAdmin = () => setCurrentPage('admin');
  const navigateToArticle = (slug: string) => {
    setCurrentArticleSlug(slug);
    setCurrentPage('article');
  };
  const navigateToEditor = () => setCurrentPage('admin-editor');

  // Verificar autenticação e rota ao carregar a página
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 [APP] Inicializando app...');
        console.log('📍 [APP] URL atual:', window.location.href);
        console.log('🕐 [APP] Timestamp:', new Date().toISOString());
        
        // NÃO limpar dados automaticamente para manter a sessão do Supabase
        console.log('⚠️ [APP] Pulando limpeza automática para manter sessão do Supabase');
        
        // Primeiro verificar autenticação
        console.log('🔐 [APP] Verificando autenticação...');
        const hasActiveSession = await authService.checkSession();
        console.log('🔐 [APP] Sessão ativa:', hasActiveSession);
        setIsAdminAuthenticated(hasActiveSession);
        
        // Depois detectar rota baseada na URL
        const path = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;
        const fullUrl = window.location.href;
        
        console.log('📍 Detectando rota:', { path, search, hash, fullUrl });
        
        // Verificar se há tokens de reset de senha na URL
        const hasResetTokens = search.includes('access_token') || 
                             hash.includes('access_token') || 
                             fullUrl.includes('access_token') ||
                             fullUrl.includes('refresh_token');
        
        if (path === '/admin') {
          console.log('🎯 Rota /admin detectada');
          // Agora isAdminAuthenticated já foi definido
          if (hasActiveSession) {
            // Verificar se há parâmetros de editor na URL
            const urlParams = new URLSearchParams(search);
            const editorMode = urlParams.get('editor');
            console.log('📝 Editor mode:', editorMode);
            
            if (editorMode === 'new' || editorMode === 'edit') {
              console.log('➡️ Redirecionando para admin-editor');
              setCurrentPage('admin-editor');
            } else {
              console.log('➡️ Redirecionando para admin');
              setCurrentPage('admin');
            }
          } else {
            console.log('➡️ Redirecionando para admin-login');
            setCurrentPage('admin-login');
          }
        } else if (path === '/reset-password' || hasResetTokens) {
          console.log('➡️ Redirecionando para reset-password');
          setCurrentPage('reset-password');
        } else {
          console.log('🏠 Mantendo página home');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar app:', error);
        setIsAdminAuthenticated(false);
      }
    };

    initializeApp();
  }, []);


  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('admin-login');
    }
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentPage('admin');
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

  if (currentPage === 'admin-editor') {
    return (
      <>
        <ArticleEditor 
          article={null} 
          onSave={async (articleData: Partial<BlogArticle>, isPublish: boolean = false) => {
            try {
              console.log('🔄 onSave chamado:', { isPublish, articleData: { title: articleData.title, published: articleData.published } });
              
              // Para autosave, apenas salvar sem redirecionar
              const result = await blogService.createArticle(articleData);
              console.log('✅ Artigo salvo com sucesso:', result);
              
              if (isPublish) {
                console.log('📤 Publicação detectada - redirecionando para admin');
                // Para publicação, redirecionar após salvar
                window.history.replaceState({}, '', '/admin');
                setCurrentPage('admin');
              } else {
                console.log('💾 Autosave - NÃO redirecionando');
              }
              
              return result; // Retornar o artigo criado para capturar o ID
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