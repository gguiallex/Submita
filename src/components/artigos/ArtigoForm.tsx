'use client'

import { useEffect, useState } from "react";

interface Area {
    id: number;
    nome: string;
}

export default function ArtigoForm({ onSubmit, isLoading }: any) {
    const [titulo, setTitulo] = useState('');
    const [resumo, setResumo] = useState('');
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [areasDisponiveis, setAreasDisponiveis] = useState<Area[]>([]);
    const [areasSelecionadas, setAreasSelecionadas] = useState<number[]>([]);

    useEffect(() => {
        fetch('/api/areas')
            .then(res => res.json())
            .then(data => setAreasDisponiveis(data));
    }, []);

    const toggleArea = (id: number) => {
        setAreasSelecionadas(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (areasSelecionadas.length === 0) {
            alert("Selecione pelo menos uma área temática.");
            return;
        }
        if (!arquivo) {
            alert("Por favor, selecione o arquivo PDF do trabalho.");
            return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('resumo', resumo);
        formData.append('pdf', arquivo);
        formData.append('areas', JSON.stringify(areasSelecionadas));

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Título do Trabalho</label>
                <input
                    type="text"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Uma análise sobre algoritmos de IA..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Resumo (Abstract)</label>
                <textarea
                    required
                    rows={5}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Descreva brevemente sua pesquisa..."
                    value={resumo}
                    onChange={(e) => setResumo(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="pdf-upload" className="block text-sm font-bold text-slate-700 mb-2">
                    Trabalho em PDF
                </label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors">
                    <input
                        id="pdf-upload" // Adicionado para o label
                        type="file"
                        accept=".pdf"
                        required
                        aria-label="Selecionar arquivo PDF do trabalho" // Resolve o erro de acessibilidade
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                    />
                    <div className="space-y-1">
                        <p className="text-sm text-slate-600 font-medium">
                            {arquivo ? arquivo.name : 'Clique para selecionar o PDF'}
                        </p>
                        <p className="text-xs text-slate-400 italic">Apenas arquivos .pdf</p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Áreas Temáticas</label>
                <div className="flex flex-wrap gap-2">
                    {areasDisponiveis.map((area) => (
                        <button
                            type="button"
                            key={area.id}
                            onClick={() => toggleArea(area.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${areasSelecionadas.includes(area.id)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
                                } border`}
                        >
                            {area.nome}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
                {isLoading ? 'ENVIANDO...' : 'CONFIRMAR SUBMISSÃO'}
            </button>
        </form>
    )
}