'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ArtigoForm from '@/components/artigos/ArtigoForm';
import { useState } from 'react';

export default function SubmeterArtigoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmissao = async (dados: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/artigos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...dados, 
          edicaoId: Number(id),
          usuarioId: user.id // O usuário logado será o autor principal
        }),
      });

      if (res.ok) {
        alert("Artigo submetido com sucesso!");
        router.push(`/edicoes/${id}`);
      }
    } catch (error) {
      alert("Erro ao submeter. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-20 text-center">Você precisa estar logado para submeter.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-800 mb-2">Submeter Artigo</h1>
      <p className="text-slate-500 mb-8">Preencha os dados abaixo para enviar seu trabalho para avaliação.</p>
      
      <ArtigoForm onSubmit={handleSubmissao} isLoading={loading} />
    </div>
  );
}