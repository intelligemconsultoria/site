import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from "lucide-react";
import { blogService, BlogArticle } from "../services/blogService";
import { toast } from "sonner";

interface ArticlePageProps {
  slug: string;
  onBack: () => void;
}

export function ArticlePage({ slug, onBack }: ArticlePageProps) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      console.log('📄 Carregando artigo com slug:', slug);
      const data = await blogService.getArticleBySlug(slug);
      console.log('📄 Dados recebidos:', data);
      if (data) {
        setArticle(data);
      } else {
        console.log('❌ Artigo não encontrado para slug:', slug);
        setError('Artigo não encontrado');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar artigo:', err);
      setError('Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback para copiar URL
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para a área de transferência!');
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-white/70">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Artigo não encontrado</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <Button onClick={onBack} className="bg-emerald-400 text-black hover:bg-emerald-500">
            Voltar ao Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900/50 to-transparent py-8 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:text-emerald-400 hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleShare}
              className="text-white hover:text-emerald-400 hover:bg-white/10 gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo do artigo */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho do artigo */}
          <div className="mb-8">
            <Badge className="bg-emerald-400 text-black mb-4">
              {article.category}
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-white/60 text-sm mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.read_time}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {article.tags.length} tags
              </div>
            </div>
          </div>

          {/* Imagem principal */}
          <div className="mb-12">
            <ImageWithFallback
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Conteúdo do artigo */}
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardContent className="p-8">
              <div 
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(/\n/g, '<br>') 
                }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg text-white mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-white/20 text-white/70">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-4">
            <Button onClick={onBack} className="bg-emerald-400 text-black hover:bg-emerald-500">
              Voltar ao Blog
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
