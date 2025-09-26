import React from "react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

export function CasesSection() {
  const cases = [
    {
      title: "Transformação Digital no Varejo",
      company: "Rede Nacional de Lojas",
      challenge: "Unificação de dados de 200+ lojas e otimização de estoque",
      solution: "Implementação do GemFlow para integração de sistemas e GemInsights para dashboards em tempo real",
      results: [
        "35% redução no excesso de estoque",
        "28% aumento na margem de lucro",
        "92% de precisão nas previsões de demanda"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXRhaWwlMjBhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU4NTY4MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Varejo"
    },
    {
      title: "IA Preditiva na Manufatura",
      company: "Indústria Metalúrgica",
      challenge: "Prevenção de falhas em equipamentos e otimização da produção",
      solution: "Desenvolvimento de modelos de IA com GemMind para manutenção preditiva",
      results: [
        "68% redução em paradas não programadas",
        "R$ 2.4M economizados em manutenção",
        "15% aumento na eficiência produtiva"
      ],
      image: "https://images.unsplash.com/photo-1752802469747-bff685763f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtYW51ZmFjdHVyaW5nJTIwaW5kdXN0cnklMjBhdXRvbWF0aW9ufGVufDF8fHx8MTc1ODU3OTc0MXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Manufatura"
    },
    {
      title: "Automação Financeira",
      company: "Fintech Emergente",
      challenge: "Automatização de processos de análise de crédito e compliance",
      solution: "Suite completa IntelliGem com foco em automação e conformidade regulatória",
      results: [
        "78% redução no tempo de análise",
        "99.2% de compliance regulatória",
        "45% aumento na aprovação de créditos"
      ],
      image: "https://images.unsplash.com/photo-1642406415849-a410b5d01a94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzdWNjZXNzZnVsJTIwYnVzaW5lc3MlMjB0ZWFtfGVufDF8fHx8MTc1ODU3OTczNXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Fintech"
    }
  ];

  return (
    <section id="cases" className="relative py-20 overflow-hidden">
      {/* Base: preto → grafite (claro) e variante no dark */}
      <div className="absolute inset-0 -z-10
        bg-[linear-gradient(to_bottom,#000000_0%,#0b1117_60%,#0d1218_100%)]
        dark:bg-[linear-gradient(to_bottom,#000000_0%,#06090e_60%,#0b0f12_100%)]
      " />

      {/* Feixe central (spotlight suave) vindo do topo */}
      <div className="absolute inset-0 -z-10 opacity-70
        bg-[radial-gradient(60%_180%_at_50%_-20%,rgba(17,24,39,0.65)_0%,rgba(17,24,39,0.25)_45%,transparent_70%)]
        dark:opacity-60
      " />

      {/* Vinheta lateral (bordas mais escuras, como no anexo) */}
      <div className="absolute inset-0 -z-10 opacity-70
        bg-[radial-gradient(80%_120%_at_-10%_50%,rgba(0,0,0,0.65)_0%,transparent_70%),radial-gradient(80%_120%_at_110%_50%,rgba(0,0,0,0.65)_0%,transparent_70%)]
        dark:opacity-60
      " />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Cases de Sucesso
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-white/70 max-w-3xl mx-auto">
            Conheça como transformamos dados em resultados concretos para nossos clientes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {cases.map((case_item, index) => (
            <Card 
              key={index}
              className="border border-black dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={case_item.image}
                  alt={case_item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white px-3 py-1 rounded-full text-sm">
                    {case_item.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-gray-900 dark:text-white text-xl mb-2">{case_item.title}</h3>
                  <p className="text-emerald-400 text-sm">{case_item.company}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-gray-700 dark:text-white/80 text-sm mb-1">Desafio:</h4>
                    <p className="text-gray-600 dark:text-white/60 text-sm">{case_item.challenge}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-700 dark:text-white/80 text-sm mb-1">Solução:</h4>
                    <p className="text-gray-600 dark:text-white/60 text-sm">{case_item.solution}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-700 dark:text-white/80 text-sm mb-2">Resultados:</h4>
                    <ul className="space-y-1">
                      {case_item.results.map((result, idx) => (
                        <li key={idx} className="text-gray-600 dark:text-white/60 text-sm flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border border-black dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/40"
                >
                  Ver Case Completo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border border-black dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/40 px-8"
          >
            Ver Todos os Cases
          </Button>
        </div>
      </div>
    </section>
  );
}