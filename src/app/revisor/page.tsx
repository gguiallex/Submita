'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AreaRevisorPage() {
  const { user } = useAuth();
  const [atribuicoes, setAtribuicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTarefas = async () => {
      if (!user) return;
      try {
        // AJUSTADO: Agora aponta para /api/revisores/...
        const res = await fetch(`/api/revisores/${user.id}/artigos`);
        const data = await res.json();
        setAtribuicoes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTarefas();
  }, [user]);

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Carregando tarefas...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Área do Revisor</h1>
          <p className="text-slate-500">Trabalhos atribuídos a você para avaliação técnica.</p>
        </header>

        <div className="grid gap-4">
          {atribuicoes.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:border-blue-200 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${item.respostas?.length > 0 ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {item.respostas?.length > 0 ? 'Avaliado' : 'Pendente'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">{item.artigo.titulo}</h2>
                <p className="text-xs text-slate-400">ID do Trabalho: #{item.artigo.id}</p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {item.artigo.pdfUrl && (
                  <a 
                    href={item.artigo.pdfUrl} 
                    target="_blank" 
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 text-center transition-all"
                  >
                    ABRIR PDF
                  </a>
                )}
                <Link 
                  href={`/revisor/avaliar/${item.id}`}
                  className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-100 text-center transition-all"
                >
                  {item.respostas?.length > 0 ? 'REVISAR' : 'AVALIAR'}
                </Link>
              </div>
            </div>
          ))}

          {atribuicoes.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 italic">Você não possui artigos para avaliar no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}