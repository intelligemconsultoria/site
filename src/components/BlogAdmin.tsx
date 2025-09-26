import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { blogService, BlogArticle } from "../services/blogService";
import { ArticleEditor } from "./ArticleEditor";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

interface BlogAdminProps {
  onBack: () => void;
  onLogout?: () => void;
  onNavigateToEditor?: () => void;
}

export function BlogAdmin({ onBack, onLogout, onNavigateToEditor }: BlogAdminProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadArticles();
    loadStats();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      console.log('Carregando artigos...');
      const articlesData = await blogService.getAllArticles();
      console.log('Artigos carregados:', articlesData);
      setArticles(articlesData);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
      toast.error('Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await blogService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
      try {
        await blogService.deleteArticle(id);
        setArticles(prev => prev.filter(article => article.id !== id));
        await loadStats();
        toast.success('Artigo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir artigo:', error);
        toast.error('Erro ao excluir artigo');
      }
    }
  };

  const handleEdit = (article: BlogArticle) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleNewArticle = () => {
    if (onNavigateToEditor) {
      // Usar navegação por URL para persistir o estado
      window.history.pushState({}, '', '/admin?editor=new');
      onNavigateToEditor();
    } else {
      // Fallback para o comportamento antigo
      setEditingArticle(null);
      setShowEditor(true);
    }
  };

  const handleSaveArticle = async (articleData: Partial<BlogArticle>) => {
    try {
      if (editingArticle) {
        // Atualizar artigo existente
        const updatedArticle = await blogService.updateArticle(editingArticle.id, articleData);
        if (updatedArticle) {
          setArticles(prev => prev.map(article => 
            article.id === editingArticle.id ? updatedArticle : article
          ));
        }
      } else {
        // Criar novo artigo
        const newArticle = await blogService.createArticle(articleData as Omit<BlogArticle, 'id' | 'created_at' | 'updated_at'>);
        setArticles(prev => [newArticle, ...prev]);
      }
      
      setShowEditor(false);
      setEditingArticle(null);
      await loadStats();
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      throw error;
    }
  };

  const handleCancelEditor = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  if (showEditor) {
    return (
      <ArticleEditor
        article={editingArticle}
        onSave={handleSaveArticle}
        onCancel={handleCancelEditor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900/50 dark:to-transparent py-4 border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-900 dark:text-white hover:text-emerald-300 hover:bg-emerald-500/20 gap-2 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <h1 className="text-3xl">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Administração do Blog
              </span>
            </h1>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {onLogout && (
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 gap-2 transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Sair
                </Button>
              )}
            </div>
          </div>

          <Button 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
            onClick={handleNewArticle}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Artigo
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="articles" className="data-[state=active]:bg-emerald-400 data-[state=active]:text-black">
              Artigos
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-emerald-400 data-[state=active]:text-black">
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-white/70">Carregando artigos...</span>
              </div>
            ) : (
              <div className="grid gap-6">
                {articles.map((article) => (
                  <Card key={article.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {article.title}
                            </h3>
                            {article.featured && (
                              <Badge className="bg-emerald-400/20 text-emerald-400">
                                Destaque
                              </Badge>
                            )}
                            <Badge 
                              className={article.published 
                                ? "bg-green-400/20 text-green-400" 
                                : "bg-gray-400/20 text-gray-400"
                              }
                            >
                              {article.published ? 'Publicado' : 'Rascunho'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 dark:text-white/70 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-white/60">
                            <span>Por {article.author}</span>
                            <span>•</span>
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{article.read_time}</span>
                            <span>•</span>
                            <span>{new Date(article.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(article)}
                            className="text-gray-700 dark:text-white hover:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300 hover:scale-110"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="text-gray-700 dark:text-white hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {articles.length === 0 && (
                  <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-16 h-16 text-gray-400 dark:text-white/30 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhum artigo encontrado
                      </h3>
                      <p className="text-gray-600 dark:text-white/70 mb-6">
                        Comece criando seu primeiro artigo clicando em "Novo Artigo"
                      </p>
                      <Button 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
                        onClick={handleNewArticle}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Artigo
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    Total de Artigos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalArticles || 0}
                  </div>
                  <p className="text-gray-600 dark:text-white/60 text-sm">
                    {stats.publishedArticles || 0} publicados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    Visualizações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalViews || 0}
                  </div>
                  <p className="text-gray-600 dark:text-white/60 text-sm">
                    +{stats.viewsThisMonth || 0} este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Inscritos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalSubscribers || 0}
                  </div>
                  <p className="text-gray-600 dark:text-white/60 text-sm">
                    Newsletter ativa
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Crescimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    +{stats.growthRate || 0}%
                  </div>
                  <p className="text-gray-600 dark:text-white/60 text-sm">
                    Últimos 30 dias
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Artigos Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {articles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-gray-900 dark:text-white font-medium">{article.title}</h4>
                          <p className="text-gray-600 dark:text-white/60 text-sm">
                            {new Date(article.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge 
                          className={article.published 
                            ? "bg-green-400/20 text-green-400" 
                            : "bg-gray-400/20 text-gray-400"
                          }
                        >
                          {article.published ? 'Publicado' : 'Rascunho'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stats.categories?.map((category: string) => (
                      <Badge key={category} className="bg-emerald-400/20 text-emerald-400">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}