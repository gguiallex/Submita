'use client';

import Link from 'next/link';

interface EventoCardProps {
  id: number;
  sigla: string;
  descricao: string;
  onDelete?: (id: number) => void; // Prop opcional para o botão de excluir
}

export default function EventoCard({ id, sigla, descricao, onDelete }: EventoCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-all shadow-sm group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              ID: #{id}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
            {sigla}
          </h3>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed line-clamp-2">
            {descricao}
          </p>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <Link 
            href={`/eventos/${id}`}
            className="text-center text-xs font-bold py-2 px-4 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
          >
            GERENCIAR
          </Link>
          
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}