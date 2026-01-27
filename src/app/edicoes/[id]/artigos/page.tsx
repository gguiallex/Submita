'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ListaArtigosPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [artigoAberto, setArtigoAberto] = useState<number | null>(null);

  const isAdmin = user?.role === 'ADMIN_GERAL';

  const fetchArtigos = async () => {
    if (!user) return;
    try {
      const url = isAdmin
        ? `/api/edicoes/${id}/artigos`
        : `/api/edicoes/${id}/artigos?usuarioId=${user.id}`;

      const res = await fetch(url);
      const data = await res.json();
      setArtigos(Array.isArray(data) ? data : []);
    } catch (error) {
      setArtigos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArtigos(); }, [id, user]);

  // FUNÇÃO PARA MUDAR STATUS (Admin)
  const handleStatus = async (artigoId: number, novoStatus: string) => {
    try {
      const res = await fetch(`/api/artigos/${artigoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (res.ok) fetchArtigos(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href={`/edicoes/${id}`} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider">
          ← Painel da Edição
        </Link>

        <header className="my-8">
          <h1 className="text-3xl font-black text-slate-800">
            {isAdmin ? 'Gestão de Artigos' : 'Minhas Submissões'}
          </h1>
        </header>

        <div className="grid gap-4">
          {artigos.map((artigo) => (
            <div
              key={artigo.id}
              className={`bg-white rounded-3xl border transition-all ${artigoAberto === artigo.id ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
            >
              {/* Cabeçalho do Card */}
              <div
                className="p-6 flex justify-between items-center cursor-pointer"
                onClick={() => setArtigoAberto(artigoAberto === artigo.id ? null : artigo.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{artigo.titulo}</h2>
                    {/* Badge de Status */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${artigo.status === 'APROVADO' ? 'bg-green-100 text-green-700' :
                        artigo.status === 'REJEITADO' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {artigo.status || 'PENDENTE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium uppercase">ID: #{artigo.id} • {artigo.areas?.length} áreas</p>
                </div>
                <span className={`text-xl transition-transform ${artigoAberto === artigo.id ? 'rotate-180' : ''}`}>▾</span>
              </div>

              {/* Conteúdo Expandido */}
              {artigoAberto === artigo.id && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
                  <div className="mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Resumo</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl">{artigo.resumo}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Áreas</h3>
                    <div className="flex flex-wrap gap-2">
                      {artigo.areas?.map((rel: any) => (
                        <span key={rel.area.id} className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100 uppercase">
                          {rel.area.nome}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={artigo.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all text-center flex items-center justify-center gap-2"
                  >
                    VISUALIZAR PDF
                  </a>

                  {/* AÇÕES EXCLUSIVAS DO ADMIN */}
                  {isAdmin ? (
                    <div className="pt-6 border-t border-slate-100">
                      <h3 className="text-xs font-black text-slate-800 uppercase mb-4">Ações do Administrador</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => handleStatus(artigo.id, 'APROVADO')}
                          className="bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all"
                        >
                          APROVAR SUBMISSÃO
                        </button>
                        <button
                          onClick={() => handleStatus(artigo.id, 'REJEITADO')}
                          className="bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                        >
                          REJEITAR
                        </button>
                        <button
                          className="sm:col-span-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all"
                          onClick={() => alert("Próximo passo: Atribuir Revisores")}
                        >
                          ATRIBUIR REVISORES
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                      <span>Autor: <strong>{artigo.autores?.[0]?.usuario?.nome}</strong></span>
                      <button className="text-red-500 font-bold hover:underline">REMOVER</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}