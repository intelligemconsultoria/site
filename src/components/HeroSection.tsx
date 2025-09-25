import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-black to-blue-900/20 pt-20">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-6xl leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
              Transformando dados 
            </span>
            <br />
            <span className="text-white">
              decisões que geram impacto
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-lg leading-relaxed">
           Na IntelliGem, unimos automação, BI e inteligência artificial para resolver o problema certo com a ferramenta certa. Nosso propósito é simples: transformar complexidade em clareza e dados em vantagem competitiva.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 text-white border-0 shadow-lg shadow-emerald-400/25 hover:shadow-emerald-400/40 transition-all px-8 py-6"
            >
              Agendar Conversa
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-6"
            >
              Ver Cases
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1752253604157-65fb42c30816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMG5ldHdvcmslMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODU3OTY1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Visualização de dados e tecnologia"
            className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}