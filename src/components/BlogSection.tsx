import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface BlogSectionProps {
  onNavigateToBlog?: () => void;
}

export function BlogSection({ onNavigateToBlog }: BlogSectionProps) {
  const articles = [
    {
      title: "O Futuro da Análise de Dados: Tendências para 2025",
      excerpt: "Explore as principais tendências que moldarão o cenário de dados nos próximos anos, desde IA generativa até automação inteligente.",
      author: "Equipe IntelliGem",
      date: "15 Jan 2025",
      read_time: "8 min",
      category: "Tendências",
      image_url: "https://images.unsplash.com/photo-1740908900846-4bbd4f22c975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGJsb2d8ZW58MXx8fHwxNzU4NTc5NzcwfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "IA Generativa nos Negócios: Além do Hype",
      excerpt: "Como empresas estão realmente aplicando IA generativa para resolver problemas concretos e gerar valor mensurável.",
      author: "Dr. Ana Silva",
      date: "10 Jan 2025",
      read_time: "12 min",
      category: "Inteligência Artificial",
      image_url: "https://images.unsplash.com/photo-1674027215001-9210851de177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZnV0dXJlfGVufDF8fHx8MTc1ODU0NzQyMnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Automação Inteligente: ROI e Implementação",
      excerpt: "Guia prático para calcular o retorno de investimento em automação e as melhores práticas de implementação.",
      author: "Carlos Roberto",
      date: "05 Jan 2025",
      read_time: "6 min",
      category: "Automação",
      image_url: "https://images.unsplash.com/photo-1647427060118-4911c9821b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjB0cmVuZHN8ZW58MXx8fHwxNzU4NTc5Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-gray-900/30 to-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Insights & Conhecimento
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Mantenha-se atualizado com as últimas tendências em dados, IA e automação.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
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
                  <span className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white px-3 py-1 rounded-full text-sm">
                    {article.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{article.date}</span>
                  <span>{article.read_time} de leitura</span>
                </div>

                <h3 className="text-white text-xl leading-tight group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-white/70 text-sm">{article.author}</span>
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

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8"
            onClick={onNavigateToBlog}
          >
            Ver Todos os Artigos
          </Button>
        </div>
      </div>
    </section>
  );
}