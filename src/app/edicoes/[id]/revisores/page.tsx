'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GestaoRevisoresPage() {
  const { id } = useParams();
  const [revisores, setRevisores] = useState<any[]>([]);
  const [emailBusca, setEmailBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  
  // Estado para controle de remoção
  const [confirmarRemocao, setConfirmarRemocao] = useState<number | null>(null);

  const fetchRevisores = async () => {
    try {
      const res = await fetch(`/api/edicoes/${id}/revisores`);
      const data = await res.json();
      setRevisores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar revisores", error);
    } finally {
      setLoading(false);
    }
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

  const handleRemoverRevisor = async (usuarioId: number) => {
    try {
      const res = await fetch(`/api/edicoes/${id}/revisores?usuarioId=${usuarioId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setConfirmarRemocao(null);
        fetchRevisores();
      } else {
        alert("Erro ao remover revisor");
      }
    } catch (error) {
      alert("Erro na conexão");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Carregando banca examinadora...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <Link href={`/edicoes/${id}`} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
          ← Voltar ao Painel
        </Link>

        <header className="my-8">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Banca Examinadora</h1>
          <p className="text-slate-500">Gerencie os especialistas responsáveis pelas avaliações desta edição.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* COLUNA ESQUERDA: ADICIONAR */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm sticky top-10">
              <h2 className="text-xl font-bold mb-2">Novo Revisor</h2>
              <p className="text-slate-400 text-sm mb-6">Busque um usuário pelo e-mail institucional para vinculá-lo como revisor.</p>
              
              <form onSubmit={handleAddRevisor} className="space-y-4">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="exemplo@ufla.br"
                    className="w-full p-4 pr-12 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    value={emailBusca}
                    onChange={(e) => setEmailBusca(e.target.value)}
                    required
                  />
                  <span className="absolute right-4 top-4 text-slate-300">✉</span>
                </div>
                <button 
                  type="submit"
                  disabled={buscando}
                  className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95"
                >
                  {buscando ? 'VINCULANDO...' : 'VINCULAR REVISOR'}
                </button>
              </form>
            </div>
          </div>

          {/* COLUNA DIREITA: LISTAGEM */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              Revisores Ativos 
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">{revisores.length}</span>
            </h3>

            <div className="space-y-4">
              {revisores.map((revisor) => (
                <div key={revisor.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center group transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                      {revisor.nome[0]}{revisor.sobrenome[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg leading-tight">{revisor.nome} {revisor.sobrenome}</p>
                      <p className="text-sm text-slate-400">{revisor.email}</p>
                    </div>
                  </div>

                  {confirmarRemocao === revisor.id ? (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                      <button 
                        onClick={() => handleRemoverRevisor(revisor.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-red-700"
                      >
                        SIM, REMOVER
                      </button>
                      <button 
                        onClick={() => setConfirmarRemocao(null)}
                        className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-200"
                      >
                        NÃO
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setConfirmarRemocao(revisor.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Remover revisor"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}

              {revisores.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                  <div className="text-4xl mb-4 opacity-20">🔍</div>
                  <p className="text-slate-400 font-medium">Nenhum revisor vinculado a esta edição.</p>
                  <p className="text-slate-300 text-xs">Utilize o painel lateral para adicionar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}