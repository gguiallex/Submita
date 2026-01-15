'use client';

import { useEffect, useState } from 'react';
import EventoForm from '@/components/eventos/EventoForm';
import EventoCard from '@/components/eventos/EventoCard';

interface Evento {
  id: number;
  sigla: string;
  descricao: string;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    const res = await fetch('/api/eventos');
    const data = await res.json();
    setEventos(data);
  };

  // Esta é a função que passamos para o Form
  const handleCriarEvento = async (dados: { sigla: string; descricao: string }) => {
    setLoading(true);
    try {
      await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      await fetchEventos(); // Atualiza a lista
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-slate-200 bg-white">
        <a href="/">
          <div className="flex items-center gap-3">
            <img src="/iconeSubmita.png" alt="Submita" className="w-10 h-10" />
            <span className="text-2xl font-bold text-blue-600">Submita</span>
          </div>
        </a>
        <span className="font-medium text-slate-600">Artigos</span>
        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="/eventos" className="hover:text-blue-600">Eventos</a>
          <a href="/artigos" className="hover:text-blue-600">Artigos</a>
          <a href="/" className="hover:text-blue-600">Início</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-10 flex gap-8">
        {/* Lado Esquerdo: Formulário isolado */}
        <div className="w-1/3">
          <EventoForm onSubmit={handleCriarEvento} isLoading={loading} />
        </div>

        {/* Lado Direito: Listagem */}
        <div className="flex-1">
          <h1 className=" font-bold mb-6 text-slate-800">Eventos Cadastrados</h1>
          <div className="grid gap-4">
            {eventos.map((evento) => (
              <EventoCard
                key={evento.id}
                id={evento.id}
                sigla={evento.sigla}
                descricao={evento.descricao}
                //onDelete={handleDeleteEvento}
              />
            ))}

            {eventos.length === 0 && (
              <p className="text-center text-slate-400 py-10 italic">
                Nenhum evento encontrado.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}