import React from "react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import gemFlowLogo from "figma:asset/5175adeec9ce8271bb85bf293b9214728409a71a.png";
import gemInsightsLogo from "figma:asset/7dd46db1fefa5288c113180ade65c741fafebcce.png";
import gemMindLogo from "figma:asset/c856949ab322f91d15b5aaecc11426c61fe0ed10.png";

export function SolutionsSection() {
  const solutions = [
    {
      name: "GemFlow",
      subtitle: "Automação de Processos",
      description: "Integração e automação de dados para otimizar fluxos de trabalho e eliminar tarefas repetitivas.",
      details: "Transforme processos manuais em fluxos automatizados inteligentes. Nossa plataforma conecta sistemas, padroniza dados e cria pipelines robustos que garantem eficiência operacional.",
      image: "https://images.unsplash.com/photo-1758387933125-5ac945b4e2cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbWF0aW9uJTIwcHJvY2VzcyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU4NTc5NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "emerald",
      logo: gemFlowLogo
    },
    {
      name: "GemInsights",
      subtitle: "Business Intelligence",
      description: "Dashboards e relatórios inteligentes que transformam dados complexos em insights acionáveis.",
      details: "Visualize seus dados como nunca antes. Criamos dashboards interativos e relatórios personalizados que revelam padrões ocultos e orientam decisões estratégicas em tempo real.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGludGVsbGlnZW5jZSUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTg1NjkwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "blue",
      logo: gemInsightsLogo
    },
    {
      name: "GemMind",
      subtitle: "Inteligência Artificial",
      description: "Modelos preditivos e algoritmos de IA para antecipar tendências e otimizar resultados.",
      details: "O futuro dos seus dados está aqui. Desenvolvemos modelos de machine learning e IA que preveem comportamentos, identificam oportunidades e automatizam decisões complexas.",
      image: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTg0ODA0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "purple",
      logo: gemMindLogo
    }
  ];

  return (
    <section id="solucoes" className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background dark:to-blue-900/20 light:to-white pt-20">
      {/* Gradiente preto para quebrar o visual no tema claro */}
      <div className="light:bg-gradient-to-b light:from-custom-dark light:to-transparent light:h-32 light:absolute light:top-0 light:left-0 light:right-0 light:z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Nossas Soluções
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Três verticals integradas que trabalham em sinergia para transformar seus dados em vantagem competitiva.
          </p>
        </div>

        <div className="space-y-16">
          {solutions.map((solution, index) => (
            <div
              key={solution.name}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                    solution.logo ? 'bg-white/10 backdrop-blur-sm' : `bg-gradient-to-r ${
                      solution.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                      solution.color === 'blue' ? 'from-blue-400 to-blue-600' :
                      'from-purple-400 to-purple-600'
                    }`
                  } shadow-lg ${
                    solution.color === 'emerald' ? 'shadow-emerald-400/25' :
                    solution.color === 'blue' ? 'shadow-blue-400/25' :
                    'shadow-purple-400/25'
                  }`}>
                    {solution.logo ? (
                      <img 
                        src={solution.logo} 
                        alt={`${solution.name} logo`} 
                        className="w-16 h-16"
                      />
                    ) : (
                      <div className="text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-3xl text-white">
                      <span className={`${
                        solution.color === 'emerald' ? 'text-emerald-400' :
                        solution.color === 'blue' ? 'text-blue-400' :
                        'text-purple-400'
                      }`}>
                        Gem
                      </span>
                      {solution.name.replace('Gem', '')}
                    </h3>
                    <p className={`${
                      solution.color === 'emerald' ? 'text-emerald-400' :
                      solution.color === 'blue' ? 'text-blue-400' :
                      'text-purple-400'
                    }`}>
                      {solution.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xl text-foreground/80">
                  {solution.description}
                </p>

                <p className="text-xl text-foreground/60 leading-relaxed">
                  {solution.details}
                </p>

                <Card className="border border-black dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <h4 className="text-xl mb-2">Principais benefícios:</h4>
                    <ul className="text-xl/70 text-sm space-y-1">
                      {solution.name === 'GemFlow' && (
                        <>
                          <li>• Redução de até 80% no tempo de processamento</li>
                          <li>• Integração nativa com +100 sistemas</li>
                          <li>• Monitoramento em tempo real</li>
                        </>
                      )}
                      {solution.name === 'GemInsights' && (
                        <>
                          <li>• Dashboards interativos personalizados</li>
                          <li>• Relatórios automatizados</li>
                          <li>• Análises preditivas avançadas</li>
                        </>
                      )}
                      {solution.name === 'GemMind' && (
                        <>
                          <li>• Modelos de ML sob medida</li>
                          <li>• Previsões com 95%+ de precisão</li>
                          <li>• Automação de decisões complexas</li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${
                  solution.color === 'emerald' ? 'from-emerald-400/20 to-emerald-600/20' :
                  solution.color === 'blue' ? 'from-blue-400/20 to-blue-600/20' :
                  'from-purple-400/20 to-purple-600/20'
                } rounded-3xl blur-3xl`}></div>
                <ImageWithFallback
                  src={solution.image}
                  alt={solution.name}
                  className="relative z-10 w-full h-80 object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Gradiente preto na parte inferior para quebrar o visual no tema claro */}
      <div className="light:bg-gradient-to-t light:from-custom-gray light:to-transparent light:h-24 light:absolute light:bottom-0 light:left-0 light:right-0 light:z-0"></div>
    </section>
  );
}