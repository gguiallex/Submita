'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ListaArtigosPage() {
  const { id } = useParams();
  const { user } = useAuth();

  // Estados da Lista
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [artigoAberto, setArtigoAberto] = useState<number | null>(null);

  // Estados para Atribuição de Revisores
  const [revisores, setRevisores] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [artigoParaAtribuir, setArtigoParaAtribuir] = useState<number | null>(null);

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
      console.error("Erro ao buscar artigos:", error);
      setArtigos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArtigos(); }, [id, user]);

  const abrirModalAtribuicao = async (artigoId: number) => {
    setArtigoParaAtribuir(artigoId);
    try {
      const res = await fetch(`/api/edicoes/${id}/revisores`);
      const data = await res.json();
      setRevisores(data);
      setModalAberto(true);
    } catch (error) {
      alert("Erro ao carregar lista de revisores.");
    }
  };

  const salvarAtribuicao = async (revisorId: number) => {
    try {
      const res = await fetch(`/api/artigos/${artigoParaAtribuir}/atribuir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisorId })
      });

      if (res.ok) {
        alert("Revisor atribuído com sucesso!");
        setModalAberto(false);
        fetchArtigos(); // Atualiza a lista para mostrar o novo status (EM_AVALIACAO)
      }
    } catch (error) {
      alert("Erro ao salvar atribuição.");
    }
  };

  const handleRemoverAtribuicao = async (revisorId: number) => {
    if (!confirm("Deseja realmente remover este revisor deste artigo?")) return;

    try {
      // Passamos o artigoParaAtribuir no path e o revisorId como query string
      const res = await fetch(`/api/artigos/${artigoParaAtribuir}/atribuir?usuarioId=${revisorId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchArtigos(); // Recarrega a lista para atualizar o estado do modal
      } else {
        alert("Erro ao remover revisor.");
      }
    } catch (error) {
      console.error("Erro na remoção:", error);
    }
  };

  const handleStatus = async (artigoId: number, novoStatus: string) => {
    try {
      const res = await fetch(`/api/artigos/${artigoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (res.ok) {
        fetchArtigos();
      }
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Carregando submissões...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <Link href={`/edicoes/${id}`} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
          ← Painel da Edição
        </Link>

        <header className="my-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {isAdmin ? 'Gestão de Artigos' : 'Minhas Submissões'}
          </h1>
          <p className="text-slate-500 text-sm">Edição #{id}</p>
        </header>

        <div className="grid gap-4">
          {artigos.map((artigo) => (
            <div
              key={artigo.id}
              className={`bg-white rounded-3xl border transition-all duration-300 ${artigoAberto === artigo.id ? 'border-blue-500 shadow-xl scale-[1.01]' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
            >
              {/* Cabeçalho do Card (Clickable) */}
              <div
                className="p-6 flex justify-between items-center cursor-pointer"
                onClick={() => setArtigoAberto(artigoAberto === artigo.id ? null : artigo.id)}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{artigo.titulo}</h2>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${artigo.status === 'APROVADO' ? 'bg-green-100 text-green-700' :
                      artigo.status === 'REJEITADO' ? 'bg-red-100 text-red-700' :
                        artigo.status === 'EM_AVALIACAO' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {artigo.status?.replace('_', ' ') || 'PENDENTE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    ID: #{artigo.id} • {artigo.areas?.length || 0} áreas vinculadas
                  </p>
                </div>
                <span className={`text-xl transition-transform duration-300 ${artigoAberto === artigo.id ? 'rotate-180 text-blue-600' : 'text-slate-300'}`}>
                  ▾
                </span>
              </div>

              {/* Conteúdo Expandido */}
              {artigoAberto === artigo.id && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-4">
                  {/* Resumo */}
                  <div className="mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Resumo do Trabalho</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      {artigo.resumo}
                    </p>
                  </div>

                  {/* Áreas Temáticas */}
                  <div className="mb-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Áreas de Conhecimento</h3>
                    <div className="flex flex-wrap gap-2">
                      {artigo.areas?.map((rel: any) => (
                        <span key={rel.area.id} className="bg-white text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 uppercase">
                          {rel.area.nome}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* BOTÃO DO PDF */}
                  {artigo.pdfUrl ? (
                    <a
                      href={artigo.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-red-700 transition-all text-center flex items-center justify-center gap-3 mb-8 shadow-lg shadow-red-100 active:scale-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-xl">📄</span> VISUALIZAR TRABALHO (PDF)
                    </a>
                  ) : (
                    <div className="p-4 bg-slate-100 rounded-2xl text-center text-slate-400 text-xs mb-8 italic">
                      Arquivo PDF não disponível para esta submissão.
                    </div>
                  )}

                  {/* SEÇÃO DE GESTÃO (ADMIN) OU INFORMAÇÕES (AUTOR) */}
                  {isAdmin ? (
                    <div className="pt-6 border-t border-slate-100">
                      <h3 className="text-xs font-black text-slate-800 uppercase mb-4 tracking-widest">Controle Administrativo</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStatus(artigo.id, 'APROVADO'); }}
                          className="bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md shadow-green-100"
                        >
                          APROVAR
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStatus(artigo.id, 'REJEITADO'); }}
                          className="bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                        >
                          REJEITAR
                        </button>
                        <button
                          className="sm:col-span-2 bg-slate-900 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                          onClick={(e) => { e.stopPropagation(); abrirModalAtribuicao(artigo.id); }}
                        >
                          ATRIBUIR REVISORES
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs">
                      <div className="text-slate-400">
                        Submetido por: <strong className="text-slate-600">{artigo.autores?.[0]?.usuario?.nome} {artigo.autores?.[0]?.usuario?.sobrenome}</strong>
                      </div>
                      <button className="text-red-500 font-bold hover:underline uppercase tracking-tighter">
                        Cancelar Submissão
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {artigos.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 italic">Nenhuma submissão encontrada para esta categoria.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE SELEÇÃO DE REVISOR */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Equipe de Avaliação</h2>
            <p className="text-slate-500 text-sm mb-8">Gerencie os revisores para este artigo.</p>

            <div className="space-y-3 max-h-80 overflow-y-auto mb-8 pr-2 custom-scrollbar">
              {revisores.map((revisor) => {
                const artigoAtual = artigos.find(a => a.id === artigoParaAtribuir);
                const jaAtribuido = artigoAtual?.atribuicoes?.some((at: any) => at.usuarioId === revisor.id);

                return (
                  <div key={revisor.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${jaAtribuido ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}>
                    <div className="flex-1">
                      <span className={`font-bold block ${jaAtribuido ? 'text-blue-700' : 'text-slate-700'}`}>
                        {revisor.nome} {revisor.sobrenome}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{revisor.email}</span>
                    </div>

                    {jaAtribuido ? (
                      <button
                        onClick={() => handleRemoverAtribuicao(revisor.id)}
                        className="text-[10px] bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-black hover:bg-red-600 hover:text-white transition-all uppercase"
                      >
                        Remover
                      </button>
                    ) : (
                      <button
                        onClick={() => salvarAtribuicao(revisor.id)}
                        className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-full font-black hover:shadow-lg transition-all uppercase"
                      >
                        Atribuir
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => setModalAberto(false)} className="w-full py-4 text-slate-400 font-black hover:text-slate-600 uppercase text-xs tracking-widest">
              FECHAR JANELA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}