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
  const isAdminGeral = user?.role === 'ADMIN_GERAL';
  
  // VERIFICAÇÃO DE VÍNCULOS ESPECÍFICOS DESTA EDIÇÃO
  const isRevisor = user?.vinculos?.some((v: any) => v.edicaoId === Number(id) && v.tipo === 'REVISOR');
  const isChair = user?.vinculos?.some((v: any) => v.edicaoId === Number(id) && v.tipo === 'CHAIR');
  
  const podeGerenciar = isAdminGeral || isChair;

  const getArtigosInfo = () => {
    if (!isLogado) return { titulo: "Artigos", sub: "Acesso restrito", href: "#", label: "Bloqueado" };
    if (podeGerenciar) return { titulo: "Artigos", sub: "Gerenciar submissões", href: `/edicoes/${id}/artigos`, label: "Gerenciar →" };
    return { titulo: "Meus Artigos", sub: "Minhas submissões", href: `/edicoes/${id}/artigos`, label: "Acessar →" };
  };

  const artigosCard = getArtigosInfo();

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
              {podeGerenciar ? 'Painel de Gerenciamento' : isRevisor ? 'Painel do Revisor' : 'Informações da Edição'}
            </p>
          </div>

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
            titulo={artigosCard.titulo} 
            subtitulo={artigosCard.sub} 
            href={artigosCard.href}
            cor="bg-orange-500"
            label={artigosCard.label}
            disabled={!isLogado}
          />

          {/* NOVO CARD: APARECE APENAS PARA REVISORES DESTA EDIÇÃO */}
          {isRevisor && (
            <CardGestao 
              titulo="Avaliação" 
              subtitulo="Trabalhos para revisar" 
              href="/revisor" 
              cor="bg-amber-500" 
              label="Avaliar →" 
            />
          )}

          {podeGerenciar && (
            <>
              <CardGestao titulo="Revisores" subtitulo="Banca examinadora" href={`/edicoes/${id}/revisores`} cor="bg-purple-500" label="Gerenciar →" />
              <CardGestao titulo="Perguntas" subtitulo="Critérios de avaliação" href={`/edicoes/${id}/perguntas`} cor="bg-green-500" label="Definir →" />
            </>
          )}
        </div>

        {/* BANNERS DINÂMICOS */}
        {!isLogado ? (
          <BannerLogin />
        ) : (
          <div className={`mt-12 p-8 rounded-3xl border ${isRevisor ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
            <h3 className={`font-bold mb-2 ${isRevisor ? 'text-amber-800' : 'text-blue-800'}`}>
              {isRevisor ? 'Área de Atuação: Revisor' : 'Área do Autor'}
            </h3>
            <p className={`text-sm ${isRevisor ? 'text-amber-700' : 'text-blue-600'}`}>
              {isRevisor 
                ? 'Você faz parte da banca examinadora desta edição. Utilize o card de "Avaliação" para acessar os trabalhos atribuídos a você.' 
                : 'Bem-vindo! Você pode submeter novos trabalhos ou acompanhar o status dos seus envios.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BannerLogin() {
  return (
    <div className="mt-12 p-8 bg-amber-50 rounded-3xl border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-amber-800 font-bold mb-1">Deseja participar?</h3>
        <p className="text-amber-700 text-sm">Faça login para submeter trabalhos ou acessar suas atribuições.</p>
      </div>
      <Link href="/login" className="bg-amber-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-amber-700 transition-colors">
        Fazer Login
      </Link>
    </div>
  );
}

function CardGestao({ titulo, subtitulo, href, cor, label, disabled }: any) {
  const content = (
    <div className={`bg-white p-8 rounded-3xl border border-slate-200 transition-all group h-full ${disabled ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-xl'}`}>
      <div className={`w-10 h-1 ${cor} mb-4 rounded-full`}></div>
      <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>
      <p className="text-slate-500 text-sm mb-6">{subtitulo}</p>
      <span className={`text-xs font-bold transition-colors uppercase ${disabled ? 'text-slate-300' : 'text-slate-300 group-hover:text-blue-600'}`}>
        {label}
      </span>
    </div>
  );
  if (disabled) return content;
  return <Link href={href}>{content}</Link>;
}