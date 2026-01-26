'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ListaArtigosPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  // 1. Garanta que o estado inicial seja SEMPRE um array vazio
  const [artigos, setArtigos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtigos = async () => {
      if (!user) return;
      
      try {
        const url = user.role === 'ADMIN_GERAL' 
          ? `/api/edicoes/${id}/artigos`
          : `/api/edicoes/${id}/artigos?usuarioId=${user.id}`;

        const res = await fetch(url);
        const data = await res.json();

        // 2. Verifique se o que voltou é realmente um array antes de salvar
        if (Array.isArray(data)) {
          setArtigos(data);
        } else {
          console.error("A API não retornou um array:", data);
          setArtigos([]); // Mantém como array vazio para não dar crash
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        setArtigos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtigos();
  }, [id, user]);

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Carregando artigos...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Link href={`/edicoes/${id}`} className="text-xs font-bold text-blue-600 hover:underline">
          ← VOLTAR AO PAINEL
        </Link>

        <header className="my-8">
          <h1 className="text-3xl font-black text-slate-800">
            {user?.role === 'ADMIN_GERAL' ? 'Todos os Artigos' : 'Minhas Submissões'}
          </h1>
        </header>

        <div className="grid gap-4">
          {/* 3. Use o encadeamento opcional e verifique se é array por segurança */}
          {Array.isArray(artigos) && artigos.map((artigo) => (
            <div key={artigo.id} className="bg-white p-6 rounded-2xl border border-slate-200">
               <h2 className="text-xl font-bold text-slate-800">{artigo.titulo}</h2>
               {/* ... restante do seu card ... */}
            </div>
          ))}

          {artigos.length === 0 && (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <p className="text-slate-400 italic">Nenhum artigo encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}