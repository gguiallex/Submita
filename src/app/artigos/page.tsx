import Link from "next/link";

export default function ArtigosPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="flex items-center justify-between px-10 py-6 border-b border-slate-200 bg-white">
        <a href="/">
          <div className="flex items-center gap-3">
            <img src="/iconeSubmita.png" alt="Submita" className="w-10 h-10" />
            <span className="text-2xl font-bold text-blue-600">Submita</span>
          </div>
        </a>
        <span className="font-medium text-slate-600">Artigos</span>
        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="/eventos" className="hover:text-blue-600">Eventos</a>
          <a href="/artigos" className="hover:text-blue-600">Artigos</a>
          <a href="/" className="hover:text-blue-600">Início</a>
        </nav>
      </header>
      <h1 className="text-2xl font-bold mb-4 text-[#0F172A]">Artigos</h1>
      <p className="px-10">Aqui serão listados os artigos submetidos.</p>
      <Link href="/artigos/novo">
        <button className="mt-6 ml-10 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          Submeter Novo Artigo
        </button>
      </Link>
    </div>
  );
}