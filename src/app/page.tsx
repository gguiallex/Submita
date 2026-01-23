'use client'

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-0">
      {/* Hero */}
<section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Submita</h1>
          <p className="text-xl mb-10 opacity-90">Plataforma integrada para gestão de eventos científicos.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {/* Se não estiver logado, manda para o login primeiro */}
            <Link 
              href={user ? "/artigos/novo" : "/login"} 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Submeter artigo
            </Link>
            
            <Link 
              href="/eventos" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Ver eventos
            </Link>
          </div>
        </div>
      </section>
      {/* Funcionalidades */}
      <section className="py-20 px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tudo que seu evento científico precisa
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-3">Submissão de Artigos</h3>
            <p className="text-slate-600">
              Autores podem submeter artigos em PDF, informar resumo, autores e áreas de pesquisa.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-3">Gestão de Revisores</h3>
            <p className="text-slate-600">
              Cadastro de revisores por área e distribuição inteligente de artigos para avaliação.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-3">Avaliação Integrada</h3>
            <p className="text-slate-600">
              Formulários personalizados para avaliação dos artigos submetidos.
            </p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 bg-white">
        <p>
          © {new Date().getFullYear()} Submita — Plataforma integrada para gestão de eventos científicos
        </p>
      </footer>
    </main>
  );
}
