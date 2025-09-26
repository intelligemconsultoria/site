import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from "lucide-react";
import { blogService, BlogArticle } from "../services/blogService";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para a área de transferência!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-900 mb-4">Artigo não encontrado</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button onClick={onBack} className="bg-emerald-500 text-white hover:bg-emerald-600">
            Voltar ao Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header minimalista */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleShare}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal centralizado */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="max-w-3xl mx-auto">
          
          {/* Cabeçalho do artigo */}
          <header className="mb-16 text-center">
            <Badge className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white mb-6 text-sm px-4 py-2 rounded-full shadow-lg">
              {article.category}
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl text-gray-900 mb-8 leading-tight font-bold">
              {article.title}
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              {article.excerpt}
            </p>
            
            {/* Metadados do artigo */}
            <div className="flex items-center justify-center gap-8 text-gray-500 text-sm mb-8">
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
            </div>
          </header>

          {/* Imagem principal - grande e centralizada */}
          <div className="mb-16">
            <ImageWithFallback
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 lg:h-[600px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Conteúdo do artigo - texto centralizado com Markdown */}
          <div className="prose prose-lg prose-gray max-w-none text-gray-800 leading-relaxed text-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold text-gray-900 mb-8 mt-12 first:mt-0 leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-10 first:mt-0 leading-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8 first:mt-0 leading-tight">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl font-bold text-gray-900 mb-3 mt-6 first:mt-0 leading-tight">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="mb-6 leading-relaxed text-gray-800 text-lg">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-6 pl-6 space-y-3 list-disc">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-6 pl-6 space-y-3 list-decimal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-800 leading-relaxed text-lg">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-emerald-400 pl-6 py-4 mb-8 bg-gray-50 italic text-gray-700 text-lg rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-8 text-sm">
                    {children}
                  </pre>
                ),
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-emerald-600 hover:text-emerald-700 underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-800">
                    {children}
                  </em>
                ),
                hr: () => (
                  <hr className="my-8 border-gray-300" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border-collapse border border-gray-300">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-bold text-gray-900 text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {children}
                  </td>
                )
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Tags no final */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 justify-center">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação no final */}
          <div className="mt-16 flex gap-4 justify-center">
            <Button 
              onClick={onBack} 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 px-8 py-3 shadow-lg"
            >
              Voltar ao Blog
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </article>
      </main>
    </div>
  );
}