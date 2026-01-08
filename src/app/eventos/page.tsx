'use client';

import { useEffect, useState } from 'react';

interface Evento {
  id: number;
  sigla: string;
  descricao: string;
  edicoes: { id: number; ano: number }[];
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [sigla, setSigla] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    const res = await fetch('/api/eventos');
    const data = await res.json();
    setEventos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sigla, descricao }),
    });
    setSigla('');
    setDescricao('');
    fetchEventos();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Eventos</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Sigla"
          value={sigla}
          onChange={(e) => setSigla(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Adicionar Evento</button>
      </form>
      <ul>
        {eventos.map((evento) => (
          <li key={evento.id} className="mb-2">
            <strong>{evento.sigla}</strong>: {evento.descricao}
            <br />
            Edições: {evento.edicoes.map((ed) => ed.ano).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}