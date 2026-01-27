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

  const handleSubmissao = async (formData: FormData) => {
    setLoading(true);

    formData.append('edicaoId', String(id));
    formData.append('usuarioId', String(user.id));

    try {
      const res = await fetch('/api/artigos', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert("Artigo e PDF enviados com sucesso!");
        router.push(`/edicoes/${id}/artigos`);
      }
    } catch (error) {
      alert("Erro ao enviar.");
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