'use client';

import { useState } from "react";

interface EdicaoFormProps {
    onSubmit: (data: { ano: number; }) => Promise<void>;
    isLoading?: boolean;
}

export default function EdicaoForm({ onSubmit, isLoading }: EdicaoFormProps) {
    const [ano, setAno] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ano) return;
        await onSubmit({ ano: parseInt(ano) });
        setAno('');
    };

    return(
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-tight">Nova Edição</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input 
                    type="number"
                    placeholder="Ex: 2025"
                    value={ ano }
                    onChange={(e) => setAno(e.target.value)}
                    className="w-full border p-2.5 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-xl transition-all text-sm"
                        >
                        {isLoading ? 'Salvando...' : 'Confirmar Ano'}
                    </button>
                </form>
        </div>
    );
}