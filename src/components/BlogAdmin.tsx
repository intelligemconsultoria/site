import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { blogService, BlogArticle } from "../services/blogService";
import { toast } from "sonner@2.0.3";

interface BlogAdminProps {
  onBack: () => void;
}

export function BlogAdmin({ onBack }: BlogAdminProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image: '',
    featured: false,
    published: false,
    tags: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, statsData] = await Promise.all([
        blogService.getAllArticles(),
        blogService.getStats()
      ]);
      setArticles(articlesData);
      setStats(statsData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      image: '',
      featured: false,
      published: false,
      tags: ''
    });
    setEditingArticle(null);
  };

  const handleEdit = (article: BlogArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      image: article.image,
      featured: article.featured,
      published: article.published,
      tags: article.tags.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const articleData = {
        ...formData,
        slug: formData.title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        readTime: `${Math.ceil(formData.content.length / 1000)} min`
      };

      if (editingArticle) {
        await blogService.updateArticle(editingArticle.id, articleData);
        toast.success('Artigo atualizado com sucesso!');
      } else {
        await blogService.createArticle(articleData);
        toast.success('Artigo criado com sucesso!');
      }

      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar artigo');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
    
    try {
      await blogService.deleteArticle(id);
      toast.success('Artigo excluído com sucesso!');
      await loadData();
    } catch (error) {
      toast.error('Erro ao excluir artigo');
      console.error(error);
    }
  };

  const togglePublished = async (article: BlogArticle) => {
    try {
      await blogService.updateArticle(article.id, { 
        published: !article.published 
      });
      toast.success(`Artigo ${!article.published ? 'publicado' : 'despublicado'} com sucesso!`);
      await loadData();
    } catch (error) {
      toast.error('Erro ao alterar status do artigo');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900/50 to-transparent py-8 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:text-emerald-400 hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <h1 className="text-3xl">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Administração do Blog
              </span>
            </h1>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-emerald-400 text-black hover:bg-emerald-500"
                  onClick={resetForm}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Artigo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingArticle ? 'Editar Artigo' : 'Novo Artigo'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Título</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="author" className="text-white">Autor</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerpt" className="text-white">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white">Conteúdo (Markdown)</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      rows={10}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-white">Categoria</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tendências">Tendências</SelectItem>
                          <SelectItem value="Inteligência Artificial">Inteligência Artificial</SelectItem>
                          <SelectItem value="Automação">Automação</SelectItem>
                          <SelectItem value="Business Intelligence">Business Intelligence</SelectItem>
                          <SelectItem value="Analytics">Analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags" className="text-white">Tags (separadas por vírgula)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image" className="text-white">URL da Imagem</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                      />
                      <Label htmlFor="featured" className="text-white">Artigo em destaque</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                      />
                      <Label htmlFor="published" className="text-white">Publicado</Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-emerald-400 text-black hover:bg-emerald-500"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
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

          <TabsContent value="articles" className="space-y-6">
            <div className="grid gap-4">
              {articles.map((article) => (
                <Card key={article.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-white text-lg">{article.title}</h3>
                          <Badge variant={article.published ? "default" : "secondary"}>
                            {article.published ? "Publicado" : "Rascunho"}
                          </Badge>
                          {article.featured && (
                            <Badge className="bg-yellow-500 text-black">Destaque</Badge>
                          )}
                        </div>
                        <p className="text-white/60 text-sm mb-2">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <span>Por {article.author}</span>
                          <span>{article.date}</span>
                          <span>{article.category}</span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePublished(article)}
                          className="text-white/70 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(article)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(article.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm text-white/70">Total de Artigos</CardTitle>
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-white">{stats.totalArticles}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm text-white/70">Publicados</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-white">{stats.publishedArticles}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm text-white/70">Rascunhos</CardTitle>
                  <Edit className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-white">{stats.draftArticles}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm text-white/70">Assinantes</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-white">{stats.totalSubscribers}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Categorias</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}