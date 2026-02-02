'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GestaoPerguntasPage() {
  const { id } = useParams();
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [tipo, setTipo] = useState('escala'); // escala ou texto
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const fetchPerguntas = async () => {
    try {
      const res = await fetch(`/api/edicoes/${id}/perguntas`);
      const data = await res.json();
      setPerguntas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPerguntas(); }, [id]);

  const handleAddPergunta = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    
    try {
      const res = await fetch(`/api/edicoes/${id}/perguntas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: novaPergunta, tipo })
      });

      if (res.ok) {
        setNovaPergunta('');
        fetchPerguntas();
      }
    } catch (error) {
      alert("Erro ao adicionar pergunta");
    } finally {
      setEnviando(false);
    }
  };

  const handleRemover = async (perguntaId: number) => {
    if (!confirm("Remover esta pergunta? As respostas já enviadas também serão perdidas.")) return;
    
    await fetch(`/api/edicoes/${id}/perguntas?perguntaId=${perguntaId}`, { method: 'DELETE' });
    fetchPerguntas();
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Carregando critérios...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <Link href={`/edicoes/${id}`} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
          ← Voltar ao Painel
        </Link>

        <header className="my-8">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Critérios de Avaliação</h1>
          <p className="text-slate-500">Defina as perguntas técnicas que os revisores deverão responder para cada artigo.</p>
        </header>

        {/* FORMULÁRIO DE CRIAÇÃO */}
        <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm mb-10">
          <form onSubmit={handleAddPergunta} className="space-y-6">
            <div>
              <label htmlFor="enunciado" className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                Enunciado da Pergunta
              </label>
              <input 
                id="enunciado"
                type="text" 
                placeholder="Ex: A metodologia aplicada é consistente?"
                className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
                value={novaPergunta}
                onChange={(e) => setNovaPergunta(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="tipo-resposta" className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                  Tipo de Resposta
                </label>
                <select 
                  id="tipo-resposta"
                  title="Selecione o tipo de resposta" // Resolve o erro de acessibilidade
                  className="w-full p-4 rounded-2xl border border-slate-200 outline-none bg-slate-50 hover:bg-white transition-all cursor-pointer font-bold text-slate-700"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="escala">Escala (Nota 1 a 5)</option>
                  <option value="texto">Texto (Dissertativa)</option>
                </select>
              </div>
              <button 
                type="submit"
                disabled={enviando}
                className="sm:self-end bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 active:scale-95"
              >
                {enviando ? 'SALVANDO...' : 'ADICIONAR CRITÉRIO'}
              </button>
            </div>
          </form>
        </section>

        {/* LISTAGEM DE CRITÉRIOS */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Critérios Ativos</h3>
          {perguntas.map((p, index) => (
            <div key={p.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all">
              <div className="flex gap-4 items-start">
                <span className="bg-blue-50 text-blue-600 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black mt-1">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-slate-800 text-lg leading-tight mb-1">{p.texto}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${
                      p.tipo === 'escala' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {p.tipo}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleRemover(p.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Remover pergunta"
              >
                🗑️
              </button>
            </div>
          ))}

          {perguntas.length === 0 && (
            <div className="text-center py-20 bg-slate-100/50 rounded-[40px] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 italic">Nenhum critério de avaliação cadastrado para esta edição.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}