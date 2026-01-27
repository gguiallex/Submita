'use client'

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section - Focada em Ação Direta */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        {/* Decoração sutil de fundo */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <span className="inline-block bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
            UFLA • Gestão Acadêmica
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Submita<span className="text-blue-500">.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-80 max-w-2xl mx-auto font-light leading-relaxed">
            A maneira mais inteligente de gerenciar e submeter trabalhos científicos para congressos e eventos.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/eventos" 
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 hover:scale-105 active:scale-95"
            >
              EXPLORAR EVENTOS
            </Link>
            
            {!user && (
              <Link 
                href="/registro" 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-black hover:bg-white/20 transition-all"
              >
                CRIAR MINHA CONTA
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Seção "Como funciona" - Resolve o problema do botão solto */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-800 mb-4">Passo a passo para publicar</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <StepCard 
            number="01" 
            title="Escolha o Evento" 
            desc="Navegue pela lista de eventos ativos na plataforma." 
          />
          <StepCard 
            number="02" 
            title="Selecione a Edição" 
            desc="Escolha o ano ou edição específica que está aberta." 
          />
          <StepCard 
            number="03" 
            title="Submeta o PDF" 
            desc="Envie seu resumo, áreas de pesquisa e o arquivo final." 
          />
          <StepCard 
            number="04" 
            title="Acompanhe" 
            desc="Receba os feedbacks dos revisores pelo seu painel." 
          />
        </div>
      </section>

      {/* Funcionalidades - Layout mais moderno */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-6">Feito por pesquisadores, para pesquisadores.</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  O Submita centraliza todo o fluxo editorial de um evento científico em um só lugar, desde a chamada de trabalhos até a publicação dos anais.
                </p>
                <ul className="space-y-4">
                  <FeatureItem text="Distribuição automática por áreas de pesquisa" />
                  <FeatureItem text="Interface mobile-first para revisores" />
                  <FeatureItem text="Gestão de revisores e bancas examinadoras" />
                </ul>
              </div>
              <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 aspect-video flex items-center justify-center text-slate-400 italic">
                 
              </div>
           </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="py-12 text-center text-slate-500 bg-slate-50">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
          UFLA - Lavras/MG
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Submita
        </p>
      </footer>
    </main>
  );
}

// Sub-componentes para organizar o código
function StepCard({ number, title, desc }: any) {
  return (
    <div className="relative p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <span className="text-5xl font-black text-blue-600/10 absolute top-4 right-6">{number}</span>
      <h3 className="text-lg font-bold text-slate-800 mb-2 relative z-10">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-700 font-medium">
      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
      {text}
    </li>
  );
}