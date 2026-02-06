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

  const [modalFinalAberto, setModalFinalAberto] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState<number | null>(null);

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

  // Lógica de Atribuição (Admin)
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
        setModalAberto(false);
        fetchArtigos();
      }
    } catch (error) {
      alert("Erro ao salvar atribuição.");
    }
  };

  const handleRemoverAtribuicao = async (revisorId: number) => {
    if (!confirm("Deseja realmente remover este revisor?")) return;
    try {
      const res = await fetch(`/api/artigos/${artigoParaAtribuir}/atribuir?usuarioId=${revisorId}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchArtigos();
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
      if (res.ok) fetchArtigos();
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  const handleUploadFinal = async (url: string) => {
    try {
      const res = await fetch(`/api/artigos/${artigoSelecionado}/versao-final`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfFinalUrl: url })
      });

      if (res.ok) {
        alert("Versão final eviada com sucesso!");
        setModalFinalAberto(false);
        fetchArtigos();
      }
    } catch (error) {
      alert("Erro ao salvar arquivo.");
    }
  };

  // Lógica de Feedback (Autor)
  const temAprovado = !isAdmin && artigos.some(a => a.status === 'APROVADO');

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Carregando submissões...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <Link href={`/edicoes/${id}`} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest block mb-4">
          ← Painel da Edição
        </Link>

        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              {isAdmin ? 'Gestão de Artigos' : 'Minhas Submissões'}
            </h1>
            <p className="text-slate-500 text-sm">Edição de Evento #{id}</p>
          </div>

          {isAdmin && (
            <Link
              href={`/edicoes/${id}/resultados`}
              className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
            >
              VER PARECERES DOS REVISORES
            </Link>
          )}
        </header>

        {/* Banner de Parabéns (Autor) */}
        {temAprovado && (
          <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-100 flex items-center gap-6 animate-in slide-in-from-top-4 duration-700">
            <div>
              <h2 className="text-2xl font-black">Seu trabalho foi Aprovado!</h2>
              <p className="text-emerald-50 opacity-90 font-medium">Parabéns! Agora você pode prosseguir para o envio da versão final.</p>
            </div>
          </div>
        )}

        {/* Lista de Artigos */}
        <div className="grid gap-4">
          {artigos.map((artigo) => (
            <div
              key={artigo.id}
              className={`bg-white rounded-[32px] border transition-all duration-300 ${artigoAberto === artigo.id ? 'border-blue-500 shadow-xl' : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
            >
              {/* Header do Card */}
              <div
                className="p-6 flex justify-between items-center cursor-pointer"
                onClick={() => setArtigoAberto(artigoAberto === artigo.id ? null : artigo.id)}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{artigo.titulo}</h2>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${artigo.status === 'APROVADO' ? 'bg-green-100 text-green-700' :
                      artigo.status === 'REJEITADO' ? 'bg-red-100 text-red-700' :
                        artigo.status === 'EM_AVALIACAO' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {artigo.status?.replace('_', ' ') || 'PENDENTE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                    ID: #{artigo.id} • {artigo.autores?.[0]?.usuario?.nome} {artigo.autores?.[0]?.usuario?.sobrenome}
                  </p>
                </div>
                <span className={`text-xl transition-transform ${artigoAberto === artigo.id ? 'rotate-180 text-blue-500' : 'text-slate-300'}`}>▾</span>
              </div>

              {/* Conteúdo Expandido */}
              {artigoAberto === artigo.id && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
                  <div className="mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Resumo</h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      {artigo.resumo}
                    </p>
                  </div>

                  {artigo.pdfUrl && (
                    <a
                      href={artigo.pdfUrl}
                      target="_blank"
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs text-center flex items-center justify-center gap-3 mb-8 hover:bg-blue-600 transition-all uppercase tracking-widest"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver PDF da Submissão
                    </a>
                  )}

                  {/* Ações condicionais baseadas no Role */}
                  {isAdmin ? (
                    <div className="pt-6 border-t border-slate-100">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Painel Administrativo</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleStatus(artigo.id, 'APROVADO')} className="bg-green-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-green-700">APROVAR</button>
                        <button onClick={() => handleStatus(artigo.id, 'REJEITADO')} className="bg-red-50 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-100">REJEITAR</button>
                        <button
                          onClick={() => abrirModalAtribuicao(artigo.id)}
                          className="col-span-2 bg-blue-50 text-blue-700 py-4 rounded-xl font-black text-xs mt-2 hover:bg-blue-100 uppercase tracking-widest"
                        >
                          Gerenciar Revisores
                        </button>
                      </div>
                    </div>
                  ) : artigo.status === 'APROVADO' && (
                    <div className="pt-6 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setArtigoSelecionado(artigo.id);
                          setModalFinalAberto(true);
                        }}
                        className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xs shadow-lg hover:bg-green-600 transition-all uppercase tracking-widest">
                        {artigo.pdfFinalUrl ? 'Versão Final Enviada' : 'Enviar Versão Final'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Atribuição (Admin) */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-800 mb-2 leading-tight">Vincular Revisores</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Selecione quem avaliará este artigo.</p>

            <div className="space-y-3 max-h-72 overflow-y-auto mb-8 pr-2 custom-scrollbar">
              {revisores.map((rev) => {
                const jaAtrib = artigos.find(a => a.id === artigoParaAtribuir)?.atribuicoes?.some((at: any) => at.usuarioId === rev.id);
                return (
                  <div key={rev.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${jaAtrib ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent'}`}>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{rev.nome} {rev.sobrenome}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{rev.email}</p>
                    </div>
                    <button
                      onClick={() => jaAtrib ? handleRemoverAtribuicao(rev.id) : salvarAtribuicao(rev.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter ${jaAtrib ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white'}`}
                    >
                      {jaAtrib ? 'Remover' : 'Atribuir'}
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setModalAberto(false)} className="w-full py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">Fechar Janela</button>
          </div>
        </div>
      )}

      {modalFinalAberto && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Versão Final</h2>
              <p className="text-slate-500 text-sm font-medium">
                Este é o arquivo que será publicado nos anais do evento
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 mb-8">
              <h4 className="text-[10px] font-black text-amber-700 uppercase mb-3 tracking-widest">Checklist de Publicação</h4>
              <ul>
                <li className="flex items-center gap-3 text-amber-800 text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Incluiu os nomes de todos os autores?
                </li>
                <li className="flex items-center gap-3 text-amber-800 text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Aplicou as correções sugeridas pelos revisores?
                </li>
                <li className="flex items-center gap-3 text-amber-800 text-xs font-bold">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> O arquivo está no formato PDF?
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Cole aqui o link do seu PDF (ex: Dropbox/Drive/S3)"
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-dashed boorder-slate-200 outline-none focus:border-green-500 transition-all font-medium text-sm"
                id="urlFinal"
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setModalFinalAberto(false)}
                  className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">
                  cancelar
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('urlFinal') as HTMLInputElement;
                    if (input.value) handleUploadFinal(input.value);
                  }}
                  className="flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
                >Confirmar e Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}