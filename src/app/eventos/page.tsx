'use client';

import Link from 'next/link';
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="flex items-center justify-between px-10 py-6 border-b border-slate-200 bg-white">
        <Link href="/">
          <div className="flex items-center gap-3">
            <img src="/iconeSubmita.png" alt="Submita" className="w-10 h-10" />
            <span className="text-2xl font-bold text-blue-600">Submita</span>
          </div>
        </Link>
        <span className="font-medium text-slate-600">Cadastrar Eventos</span>

        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="/eventos" className="hover:text-blue-600">Eventos</a>
          <a href="/artigos" className="hover:text-blue-600">Artigos</a>
          <a href="/" className="hover:text-blue-600">Início</a>
        </nav>
      </header>
      <h1 className="text-2xl font-bold mb-4 text-[#0F172A]">Eventos</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Sigla"
          value={sigla}
          onChange={(e) => setSigla(e.target.value)}
          className="border p-2 mr-2 border-[#CBD5E1]"
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border p-2 mr-2 border-[#CBD5E1]"
          required
        />
        <button type="submit" className="bg-[#2563EB] text-white p-2">Adicionar Evento</button>
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