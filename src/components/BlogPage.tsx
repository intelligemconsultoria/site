import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, Calendar, Clock, User, Filter, Loader2 } from "lucide-react";
import { useBlog } from "../hooks/useBlog";
import { toast } from "sonner@2.0.3";

interface BlogPageProps {
  onBack: () => void;
}

export function BlogPage({ onBack }: BlogPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  
  const { articles, loading, error, searchArticles, filterByCategory, subscribeToNewsletter } = useBlog();

  const categories = ["Todos", "Tendências", "Inteligência Artificial", "Automação", "Business Intelligence", "Analytics"];

  // Funções de pesquisa e filtro
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      await searchArticles(query);
    } else {
      await filterByCategory(selectedCategory);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setSearchTerm("");
    await filterByCategory(category);
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }

    setSubscribing(true);
    const result = await subscribeToNewsletter(newsletterEmail);
    
    if (result.success) {
      toast.success(result.message);
      setNewsletterEmail("");
    } else {
      toast.error(result.message);
    }
    setSubscribing(false);
  };

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-black">
      {/* Header da página do blog */}
      <div className="bg-gradient-to-b from-gray-900/50 to-transparent py-8 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:text-emerald-400 hover:bg-white/10 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Site
            </Button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Blog IntelliGem
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Insights estratégicos, tendências de mercado e conhecimento especializado em dados, IA e automação.
            </p>
          </div>

          {/* Barra de pesquisa e filtros */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                placeholder="Pesquisar artigos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-emerald-400 text-black hover:bg-emerald-500"
                      : "border-white/20 text-white/70 hover:border-emerald-400 hover:text-emerald-400"
                  }`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-6 py-12">
        {/* Artigo em destaque */}
        {featuredArticle && selectedCategory === "Todos" && !searchTerm && (
          <div className="mb-16">
            <h2 className="text-2xl mb-8 text-white/90">Artigo em Destaque</h2>
            <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-400/30 overflow-hidden">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <ImageWithFallback
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <Badge className="bg-emerald-400 text-black mb-4">
                    {featuredArticle.category}
                  </Badge>
                  <h3 className="text-2xl lg:text-3xl text-white mb-4 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-white/70 mb-6 text-lg leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-white/60 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.read_time}
                    </div>
                  </div>
                  <Button className="bg-emerald-400 text-black hover:bg-emerald-500">
                    Ler Artigo Completo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Lista de artigos */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-white/90">
              {searchTerm ? `Resultados para "${searchTerm}"` : 
               selectedCategory !== "Todos" ? `Categoria: ${selectedCategory}` : "Todos os Artigos"}
            </h2>
            <span className="text-white/60">
              {articles.length} artigo{articles.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <span className="ml-2 text-white/70">Carregando artigos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <h3 className="text-xl mb-2">Erro ao carregar artigos</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && regularArticles.length > 0 ? (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.read_time}
                    </div>
                  </div>

                  <h3 className="text-white text-xl leading-tight group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <User className="w-3 h-3" />
                      {article.author}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-400 hover:text-white hover:bg-emerald-400/20 p-0 h-auto"
                    >
                      Ler mais →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading && !error && (
          <div className="text-center py-16">
            <div className="text-white/50 mb-4">
              <Filter className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Nenhum artigo encontrado</h3>
              <p>Tente alterar os filtros ou termo de pesquisa.</p>
            </div>
          </div>
        )}

        {/* Newsletter subscription */}
        <div className="mt-20 bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-400/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl text-white mb-4">Mantenha-se Atualizado</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Receba nossos insights mais recentes diretamente no seu e-mail. Conteúdo exclusivo sobre dados, IA e automação.
          </p>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email"
              placeholder="Seu melhor e-mail"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={subscribing}
            />
            <Button 
              type="submit"
              className="bg-emerald-400 text-black hover:bg-emerald-500"
              disabled={subscribing}
            >
              {subscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Inscrevendo...
                </>
              ) : (
                'Inscrever-se'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}