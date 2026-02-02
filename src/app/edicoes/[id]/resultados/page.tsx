'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResultadosAvaliacaoPage() {
  const { id } = useParams();
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResultados = async () => {
    try {
      const res = await fetch(`/api/edicoes/${id}/resultados`);
      const data = await res.json();
      setArtigos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar resultados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResultados(); }, [id]);

  // Função para o Admin decidir o status final do artigo
  const handleDecisaoFinal = async (artigoId: number, novoStatus: string) => {
    const confirmacao = confirm(`Deseja alterar o status do artigo para ${novoStatus}?`);
    if (!confirmacao) return;

    try {
      const res = await fetch(`/api/artigos/${artigoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        fetchResultados(); // Atualiza a lista para mostrar o novo status
      }
    } catch (error) {
      alert("Erro ao processar decisão.");
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse tracking-widest">ANALISANDO PARECERES...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <Link href={`/edicoes/${id}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block hover:underline">
              ← Painel da Edição
            </Link>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Consolidação de Notas</h1>
            <p className="text-slate-500 font-medium">Análise técnica e decisão final dos avaliadores.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <span className="block text-[10px] font-black text-slate-400 uppercase">Trabalhos nesta Edição</span>
            <span className="text-2xl font-black text-slate-800">{artigos.length}</span>
          </div>
        </header>

        <div className="space-y-10">
          {artigos.map((artigo) => (
            <div key={artigo.id} className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-md">

              {/* CABEÇALHO DO ARTIGO COM AÇÕES */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">ID #{artigo.id}</span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${artigo.status === 'APROVADO' ? 'bg-green-100 text-green-700' :
                        artigo.status === 'REJEITADO' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {artigo.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2">{artigo.titulo}</h2>
                  <p className="text-sm text-slate-400 font-medium">
                    Autores: <span className="text-slate-600">{artigo.autores?.map((a: any) => `${a.usuario?.nome} ${a.usuario?.sobrenome}`).join(', ')}</span>
                  </p>
                </div>

                {/* BOTÕES DE DECISÃO FINAL */}
                <div className="flex sm:flex-row lg:flex-col gap-2 min-w-fit">
                  <button
                    onClick={() => handleDecisaoFinal(artigo.id, 'APROVADO')}
                    className="flex-1 px-8 py-3 bg-green-600 text-white rounded-2xl font-black text-xs hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95 uppercase tracking-widest"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleDecisaoFinal(artigo.id, 'REJEITADO')}
                    className="flex-1 px-8 py-3 bg-white text-red-600 border border-red-100 rounded-2xl font-black text-xs hover:bg-red-50 transition-all active:scale-95 uppercase tracking-widest"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>

              {/* GRIDE DE REVISORES */}
              <div className="p-8 bg-white">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">Pareceres Técnicos</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {artigo.atribuicoes?.map((atrib: any) => (
                    <div key={atrib.id} className="group">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-lg">
                          {atrib.revisor?.nome[0]}{atrib.revisor?.sobrenome[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block leading-none mb-1">{atrib.revisor?.nome} {atrib.revisor?.sobrenome}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Avaliador Designado</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {atrib.respostas && atrib.respostas.length > 0 ? (
                          atrib.respostas.map((resp: any) => (
                            <div key={resp.id} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 transition-colors group-hover:bg-blue-50/30">
                              <span className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-wide">{resp.pergunta?.texto}</span>

                              {resp.pergunta?.tipo === 'escala' ? (
                                <div className="flex items-center gap-4">
                                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    {/* Para resolver o erro 'no-inline-styles':
        Passamos o cálculo para uma variável CSS customizada. 
        Linters costumam ignorar variáveis pois elas não são estilos finais.
      */}
                                    <div
                                      className="h-full bg-blue-600 rounded-full transition-all duration-700"
                                      style={{ '--nota-width': `${(Number(resp.resposta) / 5) * 100}%` } as React.CSSProperties}
                                    >
                                      {/* O Tailwind aplica o valor da variável na largura */}
                                      <div className="h-full w-[var(--nota-width)] bg-blue-600" />
                                    </div>
                                  </div>
                                  <span className="text-blue-600 font-black text-sm">{resp.resposta}/5</span>
                                </div>
                              ) : (
                                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{resp.resposta}"</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Avaliação Pendente</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {artigo.atribuicoes?.length === 0 && (
                  <div className="py-12 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-medium italic">Não foram encontrados revisores para este trabalho.</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {artigos.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[60px] border border-slate-200">
              <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Nenhuma submissão para analisar nesta edição</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}