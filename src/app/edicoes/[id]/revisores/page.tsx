'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdicionarRevisoresPage() {
  const { id } = useParams();
  const [revisores, setRevisores] = useState<any[]>([]);
  const [emailBusca, setEmailBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);

  const fetchRevisores = async () => {
    const res = await fetch(`/api/edicoes/${id}/revisores`);
    const data = await res.json();
    setRevisores(data);
    setLoading(false);
  };

  useEffect(() => { fetchRevisores(); }, [id]);

  const handleAddRevisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuscando(true);
    
    try {
      const res = await fetch(`/api/edicoes/${id}/revisores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailBusca })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Revisor adicionado com sucesso!");
        setEmailBusca('');
        fetchRevisores();
      } else {
        alert(data.error || "Erro ao adicionar revisor");
      }
    } catch (error) {
      alert("Erro na requisição");
    } finally {
      setBuscando(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Carregando banca...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <Link href={`/edicoes/${id}`} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
          ← Voltar ao Painel
        </Link>

        <header className="my-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Banca Examinadora</h1>
          <p className="text-slate-500">Gerencie os revisores responsáveis por esta edição.</p>
        </header>

        {/* Formulário de Adição */}
        <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm mb-10">
          <h2 className="text-lg font-bold mb-4">Adicionar Novo Revisor</h2>
          <form onSubmit={handleAddRevisor} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Digite o e-mail do usuário..."
              className="flex-1 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={emailBusca}
              onChange={(e) => setEmailBusca(e.target.value)}
              required
            />
            <button 
              type="submit"
              disabled={buscando}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
            >
              {buscando ? 'BUSCANDO...' : 'ADICIONAR'}
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-3 italic">O revisor precisa ter uma conta criada no Submita.</p>
        </section>

        {/* Lista de Revisores Atuais */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Revisores Ativos ({revisores.length})</h3>
          {revisores.map((revisor) => (
            <div key={revisor.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
              <div>
                <p className="font-bold text-slate-800">{revisor.nome} {revisor.sobrenome}</p>
                <p className="text-xs text-slate-400">{revisor.email}</p>
              </div>
              <button className="text-slate-300 hover:text-red-500 font-bold text-xs uppercase tracking-tighter transition-colors">
                Remover
              </button>
            </div>
          ))}

          {revisores.length === 0 && (
            <div className="py-10 text-center bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">Nenhum revisor vinculado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}