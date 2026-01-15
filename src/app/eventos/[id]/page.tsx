'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EventoDetalhesPage() {
  const { id } = useParams();
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvento = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/eventos/${id}`);
      const data = await res.json();
      setEvento(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvento();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-medium text-slate-400">Carregando detalhes do evento...</div>;
  if (!evento) return <div className="p-20 text-center">Evento não encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/eventos" className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8">
          <span className="text-lg">←</span>
          <span className="text-xs font-bold uppercase tracking-widest">Voltar para Eventos</span>
        </Link>

        <header className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {evento?.sigla?.[0]}
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">{evento.sigla}</h1>
          </div>
          <p className="text-lg text-slate-500 leading-relaxed">{evento.descricao}</p>
        </header>

        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Edições</h2>
              <p className="text-slate-500 text-sm">Gerencie os anos deste evento</p>
            </div>
            {/* O botão de "Nova Edição" que usaremos depois */}
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
              + ADICIONAR ANO
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {evento.edicoes?.map((ed: any) => (
              <Link 
                key={ed.id} 
                href={`/edicoes/${ed.id}`}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <span className="text-2xl font-black text-slate-700 group-hover:text-blue-600 tracking-tighter">
                  {ed.ano}
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase group-hover:text-blue-400">
                  Painel da Edição →
                </span>
              </Link>
            ))}
            
            {evento.edicoes?.length === 0 && (
              <div className="col-span-full py-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <p className="text-slate-400 italic">Nenhuma edição cadastrada para este evento.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}