export function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-black to-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Sobre a IntelliGem
            </span>
          </h2>
          
          <p className="text-xl text-white/80 leading-relaxed">
            Mais do que uma consultoria, somos parceiros estratégicos. Unimos automação, BI e inteligência artificial para apoiar empresas que buscam crescer de forma sustentável, tomar decisões seguras e transformar desafios complexos em oportunidades.
          </p>
          
          <p className="text-lg text-white/70 leading-relaxed">
            Utilizamos as ferramentas certas para cada desafio: Business Intelligence para visualizar, 
            Inteligência Artificial para prever e Automação para otimizar. Nosso compromisso é entregar 
            soluções que não apenas resolvem problemas, mas criam vantagens competitivas duradouras.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white">Missão</h3>
              <p className="text-white/60 text-sm">
                Resolver problemas de negócio unindo automação, BI e IA — transformando dados brutos em decisões simples, rápidas e mensuráveis.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white">Visão</h3>
              <p className="text-white/60 text-sm">
                Ser a parceira de referência para empresas que querem operar dados como vantagem competitiva, com entregas ágeis, escaláveis e seguras.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-white">Valores</h3>
              <p className="text-white/60 text-sm">
                Inovação, transparência e excelência em cada projeto que desenvolvemos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}