'use client';

import { useEffect, useState } from 'react';
import EventoForm from '@/components/eventos/EventoForm';
import EventoCard from '@/components/eventos/EventoCard';
import { useAuth } from '@/context/AuthContext';

interface Evento {
  id: number;
  sigla: string;
  descricao: string;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Acessando o usuário global

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    const res = await fetch('/api/eventos');
    const data = await res.json();
    setEventos(data);
  };

  const handleCriarEvento = async (dados: { sigla: string; descricao: string }) => {
    if (!user || user.role !== 'ADMIN_GERAL') return; // Bloqueio de segurança no front

    setLoading(true);
    try {
      await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos o ID do usuário para o backend validar
        body: JSON.stringify({ ...dados, usuarioId: user.id }), 
      });
      await fetchEventos();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Ajuste de layout: centraliza a lista se o form estiver escondido */}
      <main className={`max-w-6xl mx-auto p-10 flex flex-col md:flex-row gap-8 ${!user || user.role !== 'ADMIN_GERAL' ? 'justify-center' : ''}`}>
        
        {/* Renderização condicional para o Administrador */}
        {user?.role === 'ADMIN_GERAL' && (
          <div className="w-full md:w-1/3">
            <h2 className="font-bold mb-4 text-slate-800">Novo Evento</h2>
            <EventoForm onSubmit={handleCriarEvento} isLoading={loading} />
          </div>
        )}

        <div className={user?.role === 'ADMIN_GERAL' ? 'flex-1' : 'w-full max-w-3xl'}>
          <h1 className="text-2xl font-bold mb-6 text-slate-800 text-center md:text-left">
            Eventos Cadastrados
          </h1>
          <div className="grid gap-4">
            {eventos.map((evento) => (
              <EventoCard
                key={evento.id}
                id={evento.id}
                sigla={evento.sigla}
                descricao={evento.descricao}
              />
            ))}
            {eventos.length === 0 && (
              <p className="text-center text-slate-400 py-10 italic">Nenhum evento encontrado.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}