'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PainelEdicaoPage() {
  const { id } = useParams();
  const [edicao, setEdicao] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEdicao = async () => {
      const res = await fetch(`/api/edicoes/${id}`);
      const data = await res.json();
      setEdicao(data);
      setLoading(false);
    };
    if (id) fetchEdicao();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-slate-400">Carregando painel...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-5xl mx-auto">
        {/* Voltar para o Evento Pai */}
        <Link href={`/eventos/${edicao?.eventoId}`} className="text-xs font-bold text-blue-600 hover:underline">
          ← VOLTAR PARA O EVENTO
        </Link>

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-black text-slate-800">
            {edicao?.evento?.sigla} <span className="text-blue-600">{edicao?.ano}</span>
          </h1>
          <p className="text-slate-500">Painel de Gerenciamento da Edição</p>
        </header>

        {/* Grid de Gestão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardGestao 
            titulo="Artigos" 
            subtitulo="Gerenciar submissões" 
            href={`/edicoes/${id}/artigos`}
            cor="bg-orange-500"
          />
          <CardGestao 
            titulo="Revisores" 
            subtitulo="Banca examinadora" 
            href={`/edicoes/${id}/revisores`}
            cor="bg-purple-500"
          />
          <CardGestao 
            titulo="Perguntas" 
            subtitulo="Critérios de avaliação" 
            href={`/edicoes/${id}/perguntas`}
            cor="bg-green-500"
          />
        </div>
      </div>
    </div>
  );
}

// Sub-componente rápido para os cards
function CardGestao({ titulo, subtitulo, href, cor }: any) {
  return (
    <Link href={href} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all group">
      <div className={`w-10 h-1 h-1 ${cor} mb-4 rounded-full`}></div>
      <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>
      <p className="text-slate-500 text-sm mb-6">{subtitulo}</p>
      <span className="text-xs font-bold text-slate-300 group-hover:text-blue-600 transition-colors">ACESSAR →</span>
    </Link>
  );
}