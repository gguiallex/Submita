'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PainelEdicaoPage() {
  const { id } = useParams();
  const [edicao, setEdicao] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  const isLogado = !!user;
  const isAdmin = user?.role === 'ADMIN_GERAL';
  const isChair = user?.vinculos?.some((v: any) => v.edicaoId === Number(id) && v.tipo === 'CHAIR');
  const podeGerenciar = isAdmin || isChair;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Link href={`/eventos/${edicao?.eventoId}`} className="text-xs font-bold text-blue-600 hover:underline">
          ← VOLTAR PARA O EVENTO
        </Link>

        <header className="mt-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800">
              {edicao?.evento?.sigla} <span className="text-blue-600">{edicao?.ano}</span>
            </h1>
            <p className="text-slate-500">
              {podeGerenciar ? 'Painel de Gerenciamento da Edição' : 'Informações da Edição'}
            </p>
          </div>

          {/* BOTÃO DE SUBMISSÃO: Visível apenas para quem está logado e não é o administrador da edição */}
          {isLogado && !podeGerenciar && (
            <Link 
              href={`/edicoes/${id}/submeter`}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all text-center"
            >
              SUBMETER TRABALHO
            </Link>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardGestao 
            titulo="Artigos" 
            subtitulo={podeGerenciar ? "Gerenciar submissões" : "Ver minhas submissões"} 
            href={`/edicoes/${id}/artigos`}
            cor="bg-orange-500"
          />

          {podeGerenciar && (
            <>
              <CardGestao titulo="Revisores" subtitulo="Banca examinadora" href={`/edicoes/${id}/revisores`} cor="bg-purple-500" />
              <CardGestao titulo="Perguntas" subtitulo="Critérios de avaliação" href={`/edicoes/${id}/perguntas`} cor="bg-green-500" />
            </>
          )}
        </div>

        {!isLogado ? (
          <div className="mt-12 p-8 bg-amber-50 rounded-3xl border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-amber-800 font-bold mb-1">Acesso Restrito</h3>
              <p className="text-amber-700 text-sm">Faça login para submeter artigos ou acompanhar suas participações.</p>
            </div>
            <Link href="/login" className="bg-amber-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-700 transition-colors">
              Fazer Login
            </Link>
          </div>
        ) : (
          !podeGerenciar && (
            <div className="mt-12 p-8 bg-blue-50 rounded-3xl border border-blue-100">
              <h3 className="text-blue-800 font-bold mb-2">Área do Autor</h3>
              <p className="text-blue-600 text-sm">
                Bem-vindo! Aqui você pode acompanhar o status das suas submissões e ver os feedbacks após as avaliações. Utilize o botão acima para enviar um novo trabalho.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function CardGestao({ titulo, subtitulo, href, cor }: any) {
  return (
    <Link href={href} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all group">
      <div className={`w-10 h-1 ${cor} mb-4 rounded-full`}></div>
      <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>
      <p className="text-slate-500 text-sm mb-6">{subtitulo}</p>
      <span className="text-xs font-bold text-slate-300 group-hover:text-blue-600 transition-colors uppercase">Acessar →</span>
    </Link>
  );
}