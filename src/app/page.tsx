import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <img src="/iconeSubmita.png" alt="Submita" className="w-10 h-10" />
          <span className="text-2xl font-bold text-blue-600">Submita</span>
        </div>

        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="/eventos" className="hover:text-blue-600">Eventos</a>
          <a href="/artigos" className="hover:text-blue-600">Artigos</a>
          <a href="/" className="hover:text-blue-600">Início</a>
        </nav>
      </header>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-br from-blue-600 to-violet-600 text-white">
        <h1 className="text-5xl font-bold mb-6">
          Submita
        </h1>

        <p className="text-xl max-w-2xl mb-8">
          Plataforma integrada para gestão de eventos científicos.
        </p>

        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-slate-100 transition">
            Submeter artigo
          </button>

          <Link href="/eventos">
            <button className="px-6 py-3 rounded-xl border border-white text-white hover:bg-white/10 transition">
              Ver eventos
            </button>
          </Link>
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
