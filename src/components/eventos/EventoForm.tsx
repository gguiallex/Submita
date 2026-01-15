'use client';

import { useState } from 'react';

interface EventoFormProps {
  onSubmit: (data: { sigla: string; descricao: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function EventoForm({ onSubmit, isLoading }: EventoFormProps) {
  const [sigla, setSigla] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ sigla, descricao });
    // Só limpa se o envio der certo
    setSigla('');
    setDescricao('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">Novo Evento</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sigla do Evento
          </label>
          <input
            type="text"
            placeholder="Ex: SBBD"
            value={sigla}
            onChange={(e) => setSigla(e.target.value)}
            className="w-full mt-1 border p-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Descrição Completa
          </label>
          <textarea
            placeholder="Ex: Simpósio Brasileiro de Banco de Dados"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full mt-1 border p-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-100"
        >
          {isLoading ? 'Salvando...' : 'Adicionar Evento'}
        </button>
      </form>
    </div>
  );
}